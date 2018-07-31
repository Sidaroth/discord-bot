import secrets from '../../secrets.json';
import axios from 'axios';
import Discord from 'discord.js';

function getRaceString(raceId) {
    switch (raceId) {
        case 1:
            return 'Human';
        case 2:
            return 'Orc';
        case 3:
            return 'Dwarf';
        case 4:
            return 'Night Elf';
        case 5:
            return 'Undead';
        case 6:
            return 'Tauren';
        case 7:
            return 'Gnome';
        case 8:
            return 'Troll';
        case 9:
            return 'Goblin';
        case 10:
            return 'Blood Elf';
        case 11:
            return 'Draenei';
        case 22:
            return 'Worgen';
        case 24:
            return 'Pandaren';
        case 25:
            return 'Pandaren';
        case 26:
            return 'Pandaren';
        case 27:
            return 'Nightborne';
        case 28:
            return 'Highmountain Tauren';
        case 29:
            return 'Void Elf';
        case 30:
            return 'Lightforged Draenei';
        case 34:
            return 'Dark Iron Dwarf';
        case 36:
            return "Mag'har Orc";
    }
    return '';
}

function getClassString(classId) {
    const classNames = [
        'Warrior',
        'Paladin',
        'Hunter',
        'Rogue',
        'Priest',
        'Death Knight',
        'Shaman',
        'Mage',
        'Warlock',
        'Monk',
        'Druid',
        'Demon Hunter',
    ];
    return classNames[classId - 1];
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
                const fullName = titleObject ? titleObject.name.replace('%s', name) : '';
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
                    message.channel.send("I'm afraid I coulnd't find any characters on that realm, with that name.");
                } else {
                    console.error(err);
                }
            });
    },
};
