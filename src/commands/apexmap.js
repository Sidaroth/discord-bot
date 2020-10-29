import { MessageAttachment } from 'discord.js';

export default {
    name: 'apexmap',
    description: 'description',
    execute: async (message, args) => {
        const map = new MessageAttachment('https://i.imgur.com/1gELmjO.jpg');
        return message.channel.send(map);
    },
};
