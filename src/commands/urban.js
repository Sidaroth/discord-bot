import snekfetch from 'snekfetch';

module.exports = {
    name: 'urban',
    description: 'Provides an urban dictionary definition of the given word.',
    cooldown: 5,
    aliases: ['udb'],
    usage: '<word>',
    requiresArgs: true,
    execute(message, args) {
        const word = args.shift().toLowerCase();

        message.channel.send(cat.file);
    },
};
