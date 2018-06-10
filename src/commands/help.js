import config from '../config.json';

const help = function helpFunc(command) {
    const description = config.descriptions[command];
    if (description) {
        return `**${command}**: *${description}*`;
    }

    return `**${command}** is not a valid command or it is lacking a description.`;
};

export default help;
