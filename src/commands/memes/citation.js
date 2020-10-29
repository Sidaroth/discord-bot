import { MessageAttachment } from 'discord.js';

export default {
    name: 'citation',
    description: 'Kindly lets the user know that a citation is needed!',
    cooldown: 5,
    aliases: ['cn'],
    execute: async (message, args) => {
        const attachment = new MessageAttachment('https://i.imgur.com/nb0HLsT.png');
        return message.channel.send(attachment);
    },
};
