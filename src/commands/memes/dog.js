import axios from 'axios';
import { Attachment } from 'discord.js';

export default {
    name: 'dog',
    description: 'Eyebleach in barktastic form.',
    cooldown: 5,
    execute: async (message, args) => {
        const uri = 'https://api.thedogapi.com/v1/images/search';
        axios.get(uri).then((res) => {
            const dogData = res.data[0].breeds[0];
            if (dogData) {
                message.channel.send(`Breed: **${dogData.name}** - *${dogData.temperament}*\nLifespan: ${dogData.life_span}`);
            }
            const dog = new Attachment(res.data[0].url);
            message.channel.send(dog);
        });
    },
};
