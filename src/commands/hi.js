export default {
    name: 'hi',
    description: 'The bot greets you.',
    requiresArgs: false,
    aliases: ['greet'],
    execute: async (message, args) => {
        message.channel.send(`Hi ${message.author}!`);
    },
};
