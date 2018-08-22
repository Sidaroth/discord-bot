import getRandomInt from '../utils/getRandomInt';

module.exports = {
    name: 'triggered',
    description: 'Lets everyone you are getting triggered.',
    cooldown: 3,
    execute(message, args) {
        const gifPool = [
            'https://gfycat.com/dearestspiffyalpaca',
            'https://gfycat.com/TightAlarmingJanenschia',
            'https://media1.tenor.com/images/c5dd72c7443a2d62ceb22c4e4c672f4c/tenor.gif?itemid=9536199',
            'https://media1.tenor.com/images/5bccf1071929b114887285331a6598d0/tenor.gif?itemid=5038478',
            'https://vignette.wikia.nocookie.net/animal-jam-clans-1/images/d/dd/LOLTRIG.gif/revision/latest?cb=20161021225140',
            'https://imgur.com/gallery/kYpzMGs',
        ];

        const triggeredIndex = getRandomInt(0, gifPool.length);
        const triggeredUrl = gifPool[triggeredIndex];

        message.channel.send(triggeredUrl);
    },
};
