import { Attachment } from 'discord.js';

export default {
    name: 'racist',
    description: 'Racism alert!',
    requiresArgs: false,
    execute(message, args) {
        message.channel.send(new Attachment('https://i.imgflip.com/sbalj.jpg'));
    },
};
