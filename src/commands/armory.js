import secrets from '../../secrets.json';
import axios from 'axios';
import Discord from 'discord.js';
import getRaceString from '../utils/getWowRaceString';
import getClassString from '../utils/getWowClassString';

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
        const uri = `https://eu.api.battle.net/wow/character/${server}/${character}?fields=titles,stats,guild,items&locale=en_GB&apikey=${
            secrets.blizzardAPIKey
        }`;

        axios
            .get(uri)
            .then((res) => {
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
                } = res.data;

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
                const classString = getClassString(res.data.class);
                const raceString = getRaceString(res.data.race);

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

                return message.channel.send(embed);
            })
            .catch((err) => {
                if (err.response.data.reason === 'Character not found.') {
                    message.channel.send("I'm afraid I coulnd't find any characters on that realm, with that name. If you believe this is an error, contact admin.");
                } else {
                    console.error(err);
                }
            });
    },
};
