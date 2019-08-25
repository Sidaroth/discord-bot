import musicMan from '../../features/music/musicModule';

module.exports = {
    name: 'queue',
    description: 'queues a song for play.',
    cooldown: 0,
    guildOnly: true,
    requiresArgs: true,
    usage: '<youtube uri> <youtube uri> <youtube uri> ad infinitum.',
    execute: async (message, args) => {
        args.forEach((uri) => {
            musicMan.addToQueue(uri);
        });
    },
};
