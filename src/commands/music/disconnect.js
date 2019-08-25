import musicMan from '../../features/music/musicModule';

module.exports = {
    name: 'disconnect',
    description: 'Disconnects the bot from voice channels.',
    aliases: ['dc', 'stop'],
    cooldown: 5,
    guildOnly: true,
    execute: async (message, args) => {
        musicMan.disconnect();
    },
};
