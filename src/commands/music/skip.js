import musicMan from '../../features/music/musicModule';

module.exports = {
    name: 'skip',
    description: 'Skips the current song, and plays next in queue.',
    cooldown: 5,
    guildOnly: true,
    execute: async (message, args) => {
        musicMan.skip();
    },
};
