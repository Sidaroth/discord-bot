import musicMan from '../../features/music/musicModule';

module.exports = {
    name: 'volume',
    description: 'Sets the volume the bot plays audio at.',
    aliases: ['vol'],
    cooldown: 1,
    guildOnly: true,
    requiresArgs: true,
    usage: '<volume> (0-100)',
    execute: async (message, args) => {
        musicMan.setVolume(args[0]);
    },
};
