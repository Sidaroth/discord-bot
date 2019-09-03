import musicMan from '../../features/music/musicModule';

export default {
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
