import { MessageAttachment } from 'discord.js';

export default {
    name: 'racist',
    description: 'Racism alert!',
    requiresArgs: false,
    execute: async (message, args) => {
        message.channel.send(new MessageAttachment('https://i.imgflip.com/sbalj.jpg'));
    },
};
