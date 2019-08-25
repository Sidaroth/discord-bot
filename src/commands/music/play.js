import musicMan from '../../features/music/musicModule';

module.exports = {
    name: 'play',
    description: 'Starts playing music from the current queue.',
    cooldown: 5,
    guildOnly: true,
    execute: async (message, args) => {
        musicMan.play();
    },
};
