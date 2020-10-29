import axios from 'axios';
import { Attachment } from 'discord.js';

export default {
    name: 'dog',
    description: 'Eyebleach in barktastic form.',
    cooldown: 5,
    execute: async (message, args) => {
        const uri = 'https://api.thedogapi.com/v1/images/search';
        const res = await axios.get(uri);
        const breedData = res?.data[0]?.breeds[0];
        const dog = new Attachment(res?.data[0]?.url);

        if (breedData) {
            message.channel.send(`Breed: **${breedData.name}** - *${breedData.temperament}*\nLifespan: ${breedData.life_span}`);
        }

        message.channel.send(dog);
    },
};
