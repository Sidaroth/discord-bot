import secrets from '../../secrets.json';
import tokens from '../db/tokens';
import axios from 'axios';
import Discord from 'discord.js';
import getRaceString from '../utils/getWowRaceString';
import getClassString from '../utils/getWowClassString';

function getArmoryData(server, character) {
    const uri = `https://eu.api.blizzard.com/wow/character/${server}/${character}?fields=titles,stats,guild,items&locale=en_GB&access_token=${
        tokens.blizzard.access_token
    }`;

    return axios.get(uri);
}

function getRaiderIoData(server, character) {
    const uri = `https://raider.io/api/v1/characters/profile?region=eu&realm=${server}&name=${character}&fields=mythic_plus_scores`;
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
            } = armoryData.data;

            const ilvl = items.averageItemLevelEquipped;
            const maxIlvl = items.averageItemLevel;
            const { health, power, powerType } = stats;
            const factionString = faction === 1 ? 'Horde' : 'Alliance';
            const factionColor = faction === 1 ? 'FF2211' : '0099FF';
            const genderString = gender === 1 ? 'Female' : 'Male';
            const guildName = guild.name;
            const titleObject = titles.find(title => title.selected != null);
            const fullName = titleObject ? titleObject.name.replace('%s', name) : name;
            const powerString = powerType.charAt(0).toUpperCase() + powerType.substr(1);
            const classString = getClassString(armoryData.data.class);
            const raceString = getRaceString(armoryData.data.race);

            const characterData = [];
            characterData.push(`${name} is a level ${level}, ${genderString} ${raceString} ${classString}.`);
            characterData.push(`Health: ${health}.`);
            characterData.push(`${powerString}: ${power}.`);
            characterData.push(`Faction: ${factionString} ${faction === 1 ? 'Scum!' : 'Swine!'}`);
            characterData.push(`Achievement Points: ${achievementPoints}.`);
            characterData.push(`"Honorable" kills: ${totalHonorableKills}.`);

            const embed = new Discord.RichEmbed()
                .setColor(factionColor)
                .setTitle(`${fullName} (${ilvl}/${maxIlvl})`)
                .setDescription(`Member of ${guildName} - ${realm} (${battlegroup})`)
                .setURL(`https://worldofwarcraft.com/en-gb/character/${server}/${character}`)
                .addField('Character Data', characterData.join('\n'));
            message.channel.send(embed);
        }))
        .catch((err) => {
            if (err.response.data.reason === 'Character not found.') {
                message.channel.send("I'm afraid I coulnd't find any characters on that realm, with that name. If you believe this is an error, contact admin.");
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
