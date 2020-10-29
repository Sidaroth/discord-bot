import axios from 'axios';

export default {
    name: 'lifeadvice',
    description: 'Provides (shitty) life advice!',
    aliases: ['advice'],
    cooldown: 2,
    execute: async (message, args) => {
        const uri = 'https://api.adviceslip.com/advice';
        const res = await axios.get(uri);

        message.channel.send(res.data.slip.advice);
    },
};
