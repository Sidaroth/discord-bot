import axios from 'axios';
import { MessageAttachment } from 'discord.js';

export default {
    name: 'fox',
    description: 'Eyebleach in flooftastic form',
    cooldown: 5,
    execute: async (message, args) => {
        const uri = 'https://randomfox.ca/floof/';

        try {
            const res = await axios.get(uri);
            const img = new MessageAttachment(res.data.image);
            message.channel.send(img);
        } catch {
            return;
        }
    },
};
