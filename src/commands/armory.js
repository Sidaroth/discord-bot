import secrets from '../../secrets.json';
import tokens from '../db/tokens';
import axios from 'axios';
import Discord from 'discord.js';
import getRaceString from '../utils/getWowRaceString';
import getClassString from '../utils/getWowClassString';
import config from '../config.json';

function getArmoryData(server, character) {
    const uri = `https://eu.api.blizzard.com/wow/character/${server}/${character}?fields=titles,stats,guild,items&locale=en_GB&access_token=${
        tokens.blizzard.access_token
    }`;

    return axios.get(uri);
}

function getRaiderIoData(server, character) {
    const uri = `https://raider.io/api/v1/characters/profile?region=eu&realm=${server}&name=${character}&fields=mythic_plus_scores,raid_progression,mythic_plus_highest_level_runs`;
    return axios.get(uri);
}

function getAccessToken() {
    const uri = 'https://us.battle.net/oauth/token?grant_type=client_credentials';
    return axios.post(
        uri,
        {},
        {
            auth: {
                username: secrets.blizzardClientId,
                password: secrets.blizzardClientSecret,
            },
        },
    );
}

function isTokenValid() {
    const hasAccesToken = tokens.blizzard.access_token !== '';
    const hasUpdateTime = tokens.blizzard.updateTime !== 0;
    const hasNotExpired = tokens.blizzard.updateTime + tokens.blizzard.valid_for < Math.floor(Date.now() / 1000);

    return hasAccesToken && hasUpdateTime && hasNotExpired;
}

function performQuery(message, server, character) {
    axios.all([getArmoryData(server, character), getRaiderIoData(server, character)]).then(axios
        .spread((armoryData, raiderIoData) => {
            const {
                name,
                guild,
                realm,
                level,
                titles,
                faction,
                stats,
                gender,
                battlegroup,
                achievementPoints,
                totalHonorableKills,
                items,
                thumbnail,
            } = armoryData.data;

            const hyphenatedRealm = server.replace('%20', '-');

            const ilvl = items.averageItemLevelEquipped;
            const maxIlvl = items.averageItemLevel;
            const { health, power, powerType } = stats;
            const factionString = faction === 1 ? 'Horde' : 'Alliance';
            const factionColor = faction === 1 ? 'FF2211' : '0099FF';
            const genderString = gender === 1 ? 'Female' : 'Male';
            const guildName = guild ? guild.name : '';
            const titleObject = titles.find(title => title.selected != null);
            const fullName = titleObject ? titleObject.name.replace('%s', name) : name;
            const powerString = powerType.charAt(0).toUpperCase() + powerType.substr(1);
            const classString = getClassString(armoryData.data.class);
            const raceString = getRaceString(armoryData.data.race);
            const thumbnailUri = `https://render-eu.worldofwarcraft.com/character/${thumbnail}?alt=wow/static/images/2d/avatar/6-0.jpg`;

            const mythicScores = raiderIoData.data.mythic_plus_scores;
            const mythicPlusScore = mythicScores.all;

            const mythicPlusBestRuns = raiderIoData.data.mythic_plus_highest_level_runs;
            let bestRunDesc = 'None';
            if (mythicPlusBestRuns && mythicPlusBestRuns.length > 0) {
                let bestRun = mythicPlusBestRuns[0];
                if (!bestRun.num_keystone_upgrades) {
                    const timedRun = mythicPlusBestRuns.find(run => run.num_keystone_upgrades && run.score > bestRun.score);
                    if (timedRun) bestRun = timedRun;
                }

                const chests = bestRun.num_keystone_upgrades;
                const keyLevel = bestRun.mythic_level;
                const upgradeString = chests ? `+${chests}` : 'depleted';
                bestRunDesc = `${bestRun.dungeon} ${keyLevel} ${upgradeString} (${bestRun.score})`;
            }

            const raidProgression = raiderIoData.data.raid_progression[config.currentWowTier];
            let mythicPlusRole = 'None';
            if (mythicScores.tank > 0) mythicPlusRole = 'Tank';
            if (mythicScores.healer > mythicScores.tank) mythicPlusRole = 'Healer';
            if (mythicScores.dps > mythicScores.healer && mythicScores.dps > mythicScores.tank) mythicPlusRole = 'DPS';

            const characterData = [];
            characterData.push(`${name} is a level ${level}, ${genderString} ${raceString} ${classString}.`);
            characterData.push(`Faction: ${factionString} ${faction === 1 ? 'Scum!' : 'Swine!'}`);
            characterData.push(`M+ seasonal score: ${mythicPlusScore}.`);
            characterData.push(`M+ top role: ${mythicPlusRole}.`);
            characterData.push(`M+ best run: ${bestRunDesc}.`);
            if (raidProgression) {
                characterData.push(`Raid tier progression: ${raidProgression.summary}.`);
            }
            characterData.push(`Health: ${health}.`);
            characterData.push(`${powerString}: ${power}.`);
            characterData.push(`Achievement Points: ${achievementPoints}.`);
            characterData.push(`"Honorable" kills: ${totalHonorableKills}.`);


            const guildString = guild ? `Member of ${guildName} -` : 'Guildless on';
            const description = `${guildString} ${realm} (${battlegroup})`;

            const embed = new Discord.RichEmbed()
                .setColor(factionColor)
                .setTitle(`${fullName} (${ilvl}/${maxIlvl})`)
                .setDescription(description)
                .setURL(`https://worldofwarcraft.com/en-gb/character/${hyphenatedRealm}/${character}`)
                .setThumbnail(thumbnailUri)
                .addField('Character Data', characterData.join('\n'));
            message.channel.send(embed);
        }))
        .catch((err) => {
            if (err.response && err.response.data.reason === 'Character not found.') {
                message.channel.send("I'm afraid I coulnd't find any characters on that realm with that name. If you believe this is an error, contact an admin.");
            } else {
                console.error(err);
            }
        });
}

module.exports = {
    name: 'armory',
    description: 'Provides WoW Armory information about the specified character and query.',
    cooldown: 5,
    aliases: ['wow'],
    usage: '<server> <character>, you may use spaces in the server name.',
    requiresArgs: true,
    execute(message, args) {
        let server;
        if (args.length > 2) {
            server = args.splice(0, args.length - 1).join('%20');
        } else {
            server = args.shift().toLowerCase();
        }

        const character = args.shift().toLowerCase();

        if (isTokenValid()) {
            performQuery(message, server, character);
        } else {
            // If the token is invalid, we need to request a new one first before we do any api queries.
            getAccessToken()
                .then((token) => {
                    tokens.blizzard.valid_for = token.data.expires_in;
                    tokens.blizzard.token_type = token.data.token_type;
                    tokens.blizzard.access_token = token.data.access_token;
                    tokens.blizzard.updateTime = Math.floor(Date.now() / 1000);

                    performQuery(message, server, character);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    },
};
