import axios from 'axios';

export default {
    name: 'insult',
    description: 'Provides inspiring insults for everyday use.',
    aliases: ['evilinsult'],
    cooldown: 5,
    execute: async (message, args) => {
        const uri = 'https://evilinsult.com/generate_insult.php?lang=en&type=json';

        try {
            const res = await axios.get(uri);
            message.channel.send(res.data.insult);
        } catch {
            return;
        }
    },
};
