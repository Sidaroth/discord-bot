import snekfetch from 'snekfetch';
import { Attachment } from 'discord.js';

module.exports = {
    name: 'dog',
    description: 'Eyebleach in barktastic form.',
    cooldown: 5,
    execute: async (message, args) => {
        const { body } = await snekfetch.get('https://api.thedogapi.com/v1/images/search');
        message.channel.send(new Attachment(body[0].url));
    },
};
