import getRandomInt from '../utils/getRandomInt';

export default {
    name: 'drop',
    description: 'Provides a random drop location for apex. (Backup drop in case primary drop is out of range).',
    aliases: ['apexdrop'],
    cooldown: 5,
    guildOnly: false,
    requiresArgs: false,
    usage: '<tier>\nWhere tier is either 0/low, 1/medium, 2/high in text or numbers.',
    execute: async (message, args) => {
        const tier = args[0];

        const highLoot = [
            'Relay (1)',
            'Artillery (4)',
            'North Watchtower (7)',
            'South Watchtower (10)',
            'The pit (13)',
            'Runoff (16)',
            'Airbase (19)',
            'Bunker (21)',
            'Swamps (23)',
            'Repulsor (25)',
            'Water Treatment (27)',
            'Thunderdome (29)',
            'Supply Ship',
        ];

        const mediumLoot = [
            'Slum Lakes (2)',
            'Cascades (5)',
            'The Farm (8)',
            'Wetlands (11)',
            'Bridges (14)',
            'Market (17)',
            'Skull Town (20)',
            'West Settlement (22)',
            'South Settlement (24)',
            "River's End North (26)",
            "River's End South (28)",
            'Bunker East Town (30)',
        ];

        const lowLoot = [
            'The Shattered Forest (3)',
            'East Settlement (6)',
            'High Desert (9)',
            'Landing Pad (12)',
            'Crossroads (15)',
            'Hydro Dam (18)',
        ];

        let locations = [];

        if (!tier) {
            locations = highLoot.concat(mediumLoot).concat(lowLoot);
        } else if (tier === 0 || tier.toLowerCase() === 'low') {
            locations = [].concat(lowLoot);
        } else if (tier === 1 || tier.toLowerCase() === 'medium') {
            locations = [].concat(mediumLoot);
        } else if (tier === 2 || tier.toLowerCase() === 'high') {
            locations = [].concat(highLoot);
        }

        const primaryIndex = getRandomInt(0, locations.length - 1);
        let backupIndex = getRandomInt(0, locations.length - 1);
        while (backupIndex === primaryIndex) {
            backupIndex = getRandomInt(0, locations.length - 1);
        }

        const primary = locations[primaryIndex];
        const backup = locations[backupIndex];

        message.channel.send(`**Primary:** ${primary}\n**Backup:** ${backup}`);
    },
};
