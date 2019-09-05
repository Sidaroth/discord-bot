import Discord from 'discord.js';
import secrets from '../secrets.json';
import processCommand from './commandHandler';
import commands from './commands';
import { calculateLevelTable } from './utils/calculateLevelTable';
import config from './config.json';
import updateUserStatistics from './features/userStatistics';
import triviaMan from './features/trivia/triviaModule';
import automod from './features/automoderator/automod';

const client = new Discord.Client();
const cooldowns = new Discord.Collection();
client.commands = new Discord.Collection();

// Update user experience, check for trivia answers, and other general features.
function processText(message, isCommand) {
    automod(message);

    if (message.channel.type === 'text') {
        updateUserStatistics(message.author, isCommand); // We don't track userstats for DMs.
    }

    if (triviaMan.hasActiveTrivia() && !isCommand) {
        triviaMan.processMessage(message);
    }
}

// Set up all exported commands from the commands folder.
commands.forEach((command) => {
    client.commands.set(command.name, command);
});

client.on('ready', () => {
    calculateLevelTable();
    client.user.setActivity('Try !help');
    console.log('Bot connected succesfully!');
});

client.on('message', (message) => {
    // Ignore all messages from bot users.
    if (message.author.bot) return;

    let isCommand = false;
    const hasPrefix = message.content.startsWith(config.prefix);
    if (hasPrefix) {
        const args = message.content.slice(config.prefix.length).split(/ +/);
        const commandKey = args.shift().toLowerCase();
        const command = client.commands.get(commandKey) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandKey));

        if (command) {
            isCommand = true;
            processCommand(client, message, command, args, cooldowns);
        }
    }

    processText(message, isCommand);
});

client.login(secrets.token);
