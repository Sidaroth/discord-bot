module.exports = {
    name: 'music',
    description: 'Description of music commands.',
    cooldown: 5,
    guildOnly: false,
    execute: async (message, args) => {
        const response =
            'The bot now supports various musical commands!\nUse `!summon` to have the bot join you in a room.\n' +
            '`!volume` may be used to adjust the volume (0-100).\n' +
            '`!play`, `!pause`, `!resume` can be used to control the bot as well.\n' +
            '`!queue <youtube url>` can be used with one, or more, youtube urls to queue songs for play.\n' +
            '`!skip` can be used to skip the current song, and move to the next in the queue.\n' +
            '`!stop` and `!dc` can be used to make the bot stop and disconnect completely.';
        message.channel.send(response);
    },
};
