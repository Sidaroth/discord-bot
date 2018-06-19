import getRandomInt from '../utils/getRandomInt';

module.exports = {
    name: 'xkcd',
    description: 'Provides a random, or specified XKCD comic.',
    cooldown: 5,
    aliases: ['comic'],
    usage: '<number>',
    execute(message, args) {
        const numberOfComics = 2008;
        let number = parseInt(args.shift());
        if (number == null || Number.isNaN(number)) number = getRandomInt(1, numberOfComics);

        message.channel.send(`XKCD comic ${number} coming up: https://xkcd.com/${number}/`);
    },
};
