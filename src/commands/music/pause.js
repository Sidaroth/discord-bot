import musicMan from '../../features/music/musicModule';

module.exports = {
    name: 'pause',
    description: 'Pauses any voice activity from the bot.',
    cooldown: 5,
    guildOnly: true,
    execute: async (message, args) => {
        musicMan.pause();
    },
};
