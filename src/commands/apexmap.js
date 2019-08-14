import { Attachment } from 'discord.js';

module.exports = {
    name: 'apexmap',
    description: 'description',
    execute: async (message, args) => {
        const map = new Attachment('https://i.imgur.com/1gELmjO.jpg');
        return message.channel.send(map);
    },
};
