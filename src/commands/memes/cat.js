import axios from 'axios';
import { MessageAttachment } from 'discord.js';

export default {
    name: 'cat',
    description: 'Eyebleach in meowtastic form.',
    cooldown: 5,
    execute: async (message, args) => {
        const uri = 'http://thecatapi.com/api/images/get?format=json';
        const res = await axios.get(uri);
        const cat = new MessageAttachment(res.data[0]?.url);
        message.channel.send(cat);
    },
};
