import axios from 'axios';
import { MessageAttachment } from 'discord.js';

export default {
    name: 'dadjoke',
    description: 'Terrible jokes',
    cooldown: 5,
    execute: async (message, args) => {
        const uri = 'https://icanhazdadjoke.com/';

        // this API "requires" a custom user agent + an Accept header for the return data type.
        const conf = {
            headers: {
                Accept: 'application/json',
                'User-Agent': 'Discord Bot (https://github.com/Sidaroth/discord-bot)',
            },
        };

        try {
            const res = await axios.get(uri, conf);
            message.channel.send(res.data.joke);
        } catch {
            return;
        }
    },
};
