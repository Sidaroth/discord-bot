module.exports = {
    name: 'hi',
    description: 'The bot greets you.',
    requiresArgs: false,
    execute(message, args) {
        message.channel.send(`Hi ${message.author}!`);
    },
};
