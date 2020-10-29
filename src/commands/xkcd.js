import getRandomInt from '../utils/getRandomInt';

export default {
    name: 'xkcd',
    description: 'Provides a random, or specified XKCD comic.',
    cooldown: 5,
    aliases: ['comic'],
    usage: '<number>',
    execute: async (message, args) => {
        const numberOfComics = 2378;
        let number = parseInt(args.shift());
        let response = '';
        if (number == null || Number.isNaN(number)) {
            response += 'Random XKCD coming up: ';
            number = getRandomInt(1, numberOfComics);
        } else {
            response += `XKCD ${number} coming up: `;
        }

        response += `https://xkcd.com/${number}/`;

        message.channel.send(response);
    },
};
