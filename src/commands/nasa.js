import axios from 'axios';
import { MessageAttachment } from 'discord.js';
import secrets from '../../secrets.json';

export default {
    name: 'apod',
    description: 'Get the astronomy picture of the day (The HD picture can take a while to load). Try other dates too!',
    cooldown: 5,
    guildOnly: false,
    requiresArgs: false,
    usage: ['<YYYY-MM-DD>'],
    execute: async (message, args) => {
        const date = args[0];

        let uri = `https://api.nasa.gov/planetary/apod?api_key=${secrets.nasaAPIKey}`;
        if (date) {
            uri = `${uri}&date=${date}`;
        }

        try {
            const res = await axios.get(uri);
            const { title, hdurl, explanation } = res.data;

            const img = new MessageAttachment(hdurl);
            message.channel.send(`**Astronomy Picture of the Day ${date ? `(${date}) ` : ''}- ${title}**:\n${explanation}`);
            message.channel.send(img);
        } catch (err) {
            const { code, msg } = err.response.data;
            if (code === 404) {
                const resp = `${msg} yet. Try again later, or specify a date (YYYY-MM-DD): \`!apod 2020-10-27\``;
                message.channel.send(resp);
            } else {
                message.channel.send(msg);
                console.error(err);
            }
        }
    },
};
