
module.exports = {
    name: 'admin',
    description: 'Asks the bot to call an admin.',
    cooldown: 5,
    guildOnly: true,
    execute: async (message, args) => message.channel.send('Summoning <@104945508409217024>'),
};
