import Discord from 'discord.js';
import config from './config.json';
import updateStats from './utils/updateStats';

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

const messageHandler = function messageHandlerFunc(client, message, cooldowns) {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).split(/ +/);
    const commandKey = args.shift().toLowerCase();
    const command = client.commands.get(commandKey) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandKey));

    if (!command) return;

    if (command.guildOnly && message.channel.type !== 'text') {
        message.reply("I can't execute that command in DMs");
        return;
    }

    if (command.requiresArgs && !args.length) {
        message.channel.send(`You didn't provide any arguments, ${message.author}!`);
        return;
    }

    if (!isAllowedToExecute(message.member, command)) return;

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
            return; // still on cooldown.
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args);
        // updateStats(command.name);
    } catch (error) {
        console.error(error);
        message.channel.send('There was an error trying to execute that command. Notify admin. Please provide a timestamp (or screenshot) of the event if possible.');
    }
};

export default messageHandler;
