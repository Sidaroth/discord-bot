module.exports = {
    name: 'hi',
    description: 'The bot greets you.',
    execute(message, args) {
        message.channel.send(`Hi ${message.author}!`);
    },
};
