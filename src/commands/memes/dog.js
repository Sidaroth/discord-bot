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
            const weightRange = breedData.weigth?.metric;
            const heightRange = breedData.height?.metric;
            const purpose = breedData.bred_for;
            const lifespan = breedData.life_span;

            let breedString = `Breed: **${breedData.name}** - *${breedData.temperament}*`;

            if (lifespan) breedString = `${breedString}\nLifespan: ${lifespan}`;
            if (purpose) breedString = `${breedString}\nBred for: ${purpose}`;
            if (heightRange) breedString = `${breedString}\nHeight: ${heightRange}cm`;
            if (weightRange) breedString = `${breedString}\nWeight: ${weightRange}kg`;

            message.channel.send(breedString);
        }

        message.channel.send(dog);
    },
};
