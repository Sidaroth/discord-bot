module.exports = {
    name: 'racist',
    description: 'Racism alert!',
    requiresArgs: false,
    execute(message, args) {
        message.channel.send('https://i.imgflip.com/sbalj.jpg');
    },
};
