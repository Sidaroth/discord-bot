import config from '../config.json';

module.exports = {
    name: 'help',
    description: 'List of all commands, or provides a description of what a specified command does.',
    aliases: ['commands'],
    usage: '[command name]',
    execute(message, args) {
        const response = [];
        const { commands } = message.client;

        if (!args.length) {
            response.push("Here's a list of all available commands and *(aliases)*: ");
            const commTexts = commands
                .map((command) => {
                    let text = `${command.name}`;
                    if (command.aliases) {
                        text += ` *(${command.aliases.join(', ')})*`;
                    }

                    return text;
                })
                .join(', ');
            response.push(commTexts);
            response.push(`\nYou can send \`${config.prefix}help ${this.usage}\` to get info about a specific command. I also work in DMs!`);

            // DM (Can fail if the user has blocked the bot, or has disabled DMs for privacy reasons etc. We need to catch the error in that case.)
            return message.author
                .send(response, { split: true })
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply("I've sent you a DM with all of my commands");
                })
                .catch((error) => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply("It seems like I can't DM you! Do you have DMs disabled?");
                });
        } else {
            // Provides helpful information about a specific command the user has asked about (if it exists.)
            const commandKey = args.shift().toLowerCase();
            const command = commands.get(commandKey) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandKey));

            if (!command) {
                return message.reply("That doesn't seem to be a valid command. Try `!help` to see a list of valid commands.");
            }

            response.push(` **Command:** ${command.name}`);

            if (command.aliases) response.push(`**Aliases:** ${command.aliases.join(', ')}`);
            if (command.description) response.push(`**Description:** ${command.description}`);
            if (command.usage) response.push(`**Usage:** \`${config.prefix}${command.name} ${command.usage}\``);

            response.push(`**Cooldown:** ${command.cooldown || 3} seconds.`);

            // Split splits the message into multiple messages if it contains too many characters.
            return message.channel.send(response, { split: true });
        }
    },
};
