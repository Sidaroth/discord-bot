import { MessageAttachment } from 'discord.js';

export default {
    name: 'sweeney',
    description: 'EGS memes?',
    aliases: ['egs'],
    cooldown: 5,
    execute: async (message, args) => {
        message.channel.send(new MessageAttachment('https://cdn.discordapp.com/attachments/138517832920072193/610776439289282598/1562094187945.png'));
    },
};
