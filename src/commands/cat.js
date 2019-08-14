import axios from 'axios';
import xml2js from 'xml2js';
import { Attachment } from 'discord.js';

module.exports = {
    name: 'cat',
    description: 'Eyebleach in meowtastic form.',
    cooldown: 5,
    execute(message, args) {
        const uri = 'http://thecatapi.com/api/images/get?format=xml';
        axios.get(uri).then((res) => {
            xml2js.parseString(res.data, (err, result) => {
                const cat = new Attachment(result.response.data[0].images[0].image[0].url[0]);
                message.channel.send(cat);
            });
        });
    },
};
