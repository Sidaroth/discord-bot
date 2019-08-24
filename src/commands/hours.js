function isTimeValid(time) {
    const [hour, minute, second, millisecond] = time;

    if (hour && (hour < 0 || hour > 23)) return false;
    if (minute && (minute < 0 || minute > 59)) return false;
    if (second && (second < 0 || second > 59)) return false;
    if (millisecond && (millisecond < 0 || millisecond > 999)) return false;

    return true;
}

// TODO bother checking day counts? Date.UTC() Will just roll over to next month if people really want to know about February 31st.
function isDateValid(date) {
    const [, month, day] = date;

    if (month && (month < 1 || month > 12)) return false;
    if (day && (day < 0 || day > 31)) return false;

    return true;
}

module.exports = {
    name: 'hours',
    aliases: ['countdown'],
    description: 'Gives you an indication of how many hours away the given datetime is. Timezone UTC.',
    cooldown: 5,
    requiresArgs: true,
    usage: '<date> <time> where date must be <yy/mm/dd>, <yy.mm.dd> or <yy-mm-dd> and time must be written as <hh:mm:ss> or <hh:mm>',
    execute: async (message, args) => {
        if (args.length !== 2) return message.channel.send('2 arguments must be specified for this command. Try `!help hours`.');

        const regex = /\.|\//gi; // Converts any . or / date seperator to -
        let date = args[0];
        date = date
            .replace(regex, '-')
            .split('-')
            .map(ds => Number(ds)); // '2019.08.27' --> [2019, 8, 27]

        const time = args[1].split(':').map(ts => Number(ts));

        if (!isDateValid(date)) {
            return message.channel.send(`Your specified date (${date.join('.')}) is not valid.`);
        }

        if (!isTimeValid(time)) {
            return message.channel.send(`Your specified time is not valid. ${time.join(':')}`);
        }

        date[1] = Number(date[1]) - 1; // Subtract 1 from month, because months are in range [0-11].
        const now = Date.now();
        const then = Date.UTC(...date, ...time);
        const hoursAway = Math.round((then - now) / (1000 * 60 * 60));
        const dateThen = new Date(then);
        const dateString = dateThen.toUTCString();
        const timeZoneOffset = dateThen.getTimezoneOffset() / 60;

        return message.channel.send(`${dateString} is about ${hoursAway - 2} hours away.`);
    },
};
