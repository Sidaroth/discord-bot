import axios from 'axios';
import { MessageAttachment } from 'discord.js';
import secrets from '../../secrets.json';

export default {
    name: 'apod',
    description: 'Get the astronomy picture of the day (The HD picture can take a while to load)',
    cooldown: 5,
    guildOnly: false,
    requiresArgs: false,
    execute: async (message, args) => {
        const uri = `https://api.nasa.gov/planetary/apod?api_key=${secrets.nasaAPIKey}`;

        try {
            const res = await axios.get(uri);
            const { title, hdurl, explanation }  = res.data;

            const img = new MessageAttachment(hdurl);
            message.channel.send(`**Astronomy Picture of the Day - ${title}**:\n${explanation}`);
            message.channel.send(img);
        } catch {
            return;
        }
    },
};
