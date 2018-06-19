module.exports = {
    name: 'citation',
    description: 'Kindly lets the user know that a citation is needed!',
    cooldown: 5,
    aliases: ['cn'],
    execute(message, args) {
        return message.channel.send('https://xkcd.com/285/');
    },
};
