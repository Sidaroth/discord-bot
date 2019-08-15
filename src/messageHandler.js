import Discord from 'discord.js';
import config from './config.json';
import updateStats from './utils/updateStats';
import updateUserStatistics from './features/userStatistics';
import triviaMan from './features/trivia';

function isAllowedToExecute(member, command) {
    let allowed = true;
    if (command.roleRestriction) {
        allowed = false;
        command.roleRestriction.every((role) => {
            if (member.roles.find('name', role)) {
                allowed = true; // The user has the required role, we'll allow the execution of the command.
                return false;
            }
            return true;
        });
    }

    return allowed;
}

function processText(message, isCommand) {
    if (message.channel.type === 'text') {
        updateUserStatistics(message.author, isCommand); // As long as the message is not from a bot, and we're in a guild channel, we update user stats.
    }

    if (triviaMan.hasActiveTrivia() && !isCommand) {
        triviaMan.processMessage(message);
    }
}

const messageHandler = function messageHandlerFunc(client, message, cooldowns) {
    if (message.author.bot) return undefined;
    const missingPrefix = !message.content.startsWith(config.prefix);

    if (missingPrefix) return processText(message, false);

    const args = message.content.slice(config.prefix.length).split(/ +/);
    const commandKey = args.shift().toLowerCase();
    const command = client.commands.get(commandKey) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandKey));

    if (!command) return processText(message, false);
    if (!isAllowedToExecute(message.member, command)) return processText(message, false);

    if (command.guildOnly && message.channel.type !== 'text') {
        message.reply("I can't execute that command in DMs");
        return processText(message, false);
    }

    if (command.requiresArgs && !args.length) {
        message.channel.send(`You didn't provide any arguments, ${message.author}!`);
        return processText(message, false);
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
            return processText(message, false); // still on cooldown.
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args);
        updateStats(command.name);
        return processText(message, true);
    } catch (error) {
        console.error(error);
        return message.channel.send('There was an error trying to execute that command. Summoning minion <@104945508409217024>.');
    }
};

export default messageHandler;
