import Discord from 'discord.js';
import updateCommandStats from './utils/updateCommandStats';

function isAllowedToExecute(user, command) {
    if (command.adminRestriction) {
        /* eslint-disable no-bitwise */
        const administrator = 0x00000008; // Consider also checking for channel management permissions.
        return user.roles.cache.some(role => (role.permissions & administrator) === administrator);
        /* eslint-enable no-bitwise */
    }

    return true;
}

function executeCommand(message, command, args) {
    try {
        command.execute(message, args);
        updateCommandStats(command.name);
    } catch (error) {
        console.error(error);
        message.channel.send('There was an error trying to execute that command. Summoning minion <@104945508409217024>.');
    }
}

const processCommand = function processCommandFunc(client, message, command, args, cooldowns) {
    if (command.guildOnly && message.channel.type !== 'text') {
        message.reply("I can't execute that command in DMs.");
        return;
    }

    if (command.guildOnly && !isAllowedToExecute(message.member, command)) return;

    if (command.requiresArgs && !args.length) {
        message.channel.send(`You didn't provide any arguments, ${message.author}!`);
        return;
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
            return;
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    executeCommand(message, command, args);
};

export default processCommand;
