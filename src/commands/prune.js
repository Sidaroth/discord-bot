module.exports = {
    name: 'prune',
    description: 'Admin restricted command pruning a given number of messages in the channel (1-50 at a time).',
    roleRestriction: ['Senpai'],
    requiresArgs: true,
    guildOnly: true,
    usage: '<amount>',
    cooldown: 5,
    execute(message, args) {
        const amount = parseInt(args[0]);
        if (Number.isNaN(amount)) {
            return message.channel.send(`${amount} is not a valid number`);
        }

        if (amount < 1 || amount > 50) {
            return message.channel.send(`${amount} is not in valid range (1-50).`);
        }

        return message.channel.bulkDelete(amount + 1, true).catch((err) => {
            console.error(err);
            message.channel.send('There was an error trying to prune messages.');
        });
    },
};
