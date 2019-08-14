module.exports = {
    name: 'hours',
    aliases: ['countdown'],
    description: 'Gives you an indication of how many hours away the given datetime is.',
    cooldown: 5,
    requiresArgs: true,
    usage: '<date> <time> where date can be <yy/mm/dd>, <yy.mm.dd> or <yy-mm-dd> and time must be written as <hh:mm:ss>',
    execute: async (message, args) => {
        if (args.length !== 2) return message.channel.send('2 arguments must be specified for this command. Try `!help hours`.');
        const now = Date.now();
        let date = args[0];
        const time = args[1];

        if (!date.startsWith('20')) {
            date = `20${date}`;
        }

        const dateString = `${date.replace(/\.|\//gi, '-')}T${time}Z`;
        const UTCDateTime = new Date(dateString);
        if (UTCDateTime.toString() === 'Invalid Date') return message.channel.send('You seem to have specified a date or time that does not exist in reality.');

        const then = Number(UTCDateTime);
        const hoursAway = Math.round((then - now) / (1000 * 60 * 60));

        return message.channel.send(`Your specified date and time is about ${hoursAway} hours away.`);
    },
};
