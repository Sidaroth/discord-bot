import secrets from '../../secrets.json';
import tokens from '../db/tokens';
import axios from 'axios';
import Discord from 'discord.js';
import config from '../config.json';
import oauth from 'simple-oauth2';

async function getArmoryData(server, character) {
    const hyphenatedRealm = server.replace('%20', '-');
    const uri = `https://eu.api.blizzard.com/profile/wow/character/${hyphenatedRealm}/${character}?namespace=profile-eu&locale=en_GB&access_token=${tokens.blizzard.token.access_token}`;

    const AuthString = `Bearer ${tokens.blizzard.token.access_token}`;
    const res = await axios.get(uri, {
        headers: {
            Authorization: AuthString,

        },
    });

    return res;
}

async function getRaiderIoData(server, character) {
    const uri = `https://raider.io/api/v1/characters/profile?region=eu&realm=${server}&name=${character}&fields=mythic_plus_scores,raid_progression,mythic_plus_highest_level_runs`;
    const res = await axios.get(uri);
    return res;
}

async function updateAccessToken() {
    const credentials = {
        client: {
            id: secrets.blizzardClientId,
            secret: secrets.blizzardClientSecret,
        },
        auth: {
            tokenHost: 'https://eu.battle.net',
        },
    };

    const client = new oauth.ClientCredentials(credentials);

    try {
        const token = await client.getToken();
        tokens.blizzard = token;
    } catch (err) {
        console.error(err);
    }
}

async function performQuery(message, server, character) {
    let armoryData;
    let raiderIoData;

    try {
        armoryData = await getArmoryData(server, character);
        raiderIoData = await getRaiderIoData(server, character);
    } catch (err) {
        if (err.response && err.response.data.code === 404) {
            message.channel.send("I'm afraid I couldn't find any characters on that realm with that name. If you believe this is an error, contact an admin.");
        } else {
            console.error(err);
            message.channel.send(err.response?.data?.detail);
        }
        return;
    }

    /* eslint-disable camelcase */
    const {
        gender,
        faction,
        race,
        character_class,
        active_spec,
        realm,
        name,
        guild,
        level,
        achievement_points,
        average_item_level,
        equipped_item_level,
        active_title,
    } = armoryData.data;

    const ilvl = equipped_item_level;
    const maxIlvl = average_item_level;
    const factionColor = faction.name === 'Horde' ? 'FF2211' : '0099FF';
    const fullName = active_title ? active_title.display_string.replace('{name}', name) : name;

    const mythicScores = raiderIoData.data.mythic_plus_scores;
    const mythicPlusScore = mythicScores.all;

    const mythicPlusBestRuns = raiderIoData.data.mythic_plus_highest_level_runs;
    let bestRunDesc = 'None';
    if (mythicPlusBestRuns && mythicPlusBestRuns.length > 0) {
        let bestRun = mythicPlusBestRuns[0];
        if (!bestRun.num_keystone_upgrades) {
            const timedRun = mythicPlusBestRuns.find(run => run.num_keystone_upgrades && run.score > bestRun.score);
            if (timedRun) {
                bestRun = timedRun;
            } else {
                mythicPlusBestRuns.forEach((run) => {
                    if (run.score > bestRun.score) {
                        bestRun = run;
                    }
                });
            }
        }

        const chests = bestRun.num_keystone_upgrades;
        const keyLevel = bestRun.mythic_level;
        const upgradeString = chests ? `+${chests}` : 'depleted';
        bestRunDesc = `${bestRun.dungeon} ${keyLevel} ${upgradeString} (${bestRun.score})`;
    }

    const raidProgression = raiderIoData.data.raid_progression[config.currentWowTier.key];
    let progressionString = `Raid Progression: **${config.currentWowTier.abbreviation}** ${raidProgression.summary}`;

    // If there is a second raid in the current tier.
    if (config.wowSubTier) {
        const subTierProgression = raiderIoData.data.raid_progression[config.wowSubTier.key];
        progressionString = `${progressionString} - **${config.wowSubTier.abbreviation}** ${subTierProgression.summary}`;
    }

    let mythicPlusRole = 'None';
    if (mythicScores.tank > 0) mythicPlusRole = 'Tank';
    if (mythicScores.healer > mythicScores.tank) mythicPlusRole = 'Healer';
    if (mythicScores.dps > mythicScores.healer && mythicScores.dps > mythicScores.tank) mythicPlusRole = 'DPS';

    const characterData = [];
    characterData.push(`${name} is a level ${level}, ${gender.name} ${race.name} ${active_spec.name} ${character_class.name}.`);
    characterData.push(`Faction: ${faction.name} ${faction.name === 'Horde' ? 'Scum!' : 'Swine!'}`);
    characterData.push(`M+ seasonal score: ${mythicPlusScore}.`);
    characterData.push(`M+ top role: ${mythicPlusRole}.`);
    characterData.push(`M+ best run: ${bestRunDesc}.`);
    characterData.push(progressionString);
    characterData.push(`Achievement Points: ${achievement_points}.`);

    const guildString = guild ? `Member of ${guild.name} -` : 'Guildless on';
    const description = `${guildString} ${realm.name}`;

    const embed = new Discord.MessageEmbed()
        .setColor(factionColor)
        .setTitle(`${fullName} (${ilvl}/${maxIlvl})`)
        .setDescription(description)
        .setURL(`https://worldofwarcraft.com/en-gb/character/${realm.slug}/${character}`)
        .setThumbnail(raiderIoData.data.thumbnail_url)
        .addField('Character Data', characterData.join('\n'));
    message.channel.send(embed);

    /* eslint-enable camelcase */
}

export default {
    name: 'armory',
    description: 'Provides WoW Armory information about the specified character and query.',
    cooldown: 5,
    aliases: ['wow'],
    usage: '<server> <character>, you may use spaces in the server name.',
    requiresArgs: true,
    execute: async (message, args) => {
        let server;
        if (args.length > 2) {
            server = args.splice(0, args.length - 1).join('%20');
        } else {
            server = args.shift().toLowerCase();
        }

        const character = args.shift().toLowerCase();

        await updateAccessToken();
        performQuery(message, server, character);
    },
};
