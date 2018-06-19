import Discord from 'discord.js';
import secrets from '../secrets.json';
import messageHandler from './messageHandler';
import commands from './commands';

const client = new Discord.Client();
const cooldowns = new Discord.Collection();
client.commands = new Discord.Collection();

// Set up all exported commands from the commands folder.
commands.forEach((command) => {
    client.commands.set(command.name, command);
});

client.on('ready', () => {
    client.user.setActivity('Try !help');
    console.log('Bot connected succesfully!');
});

client.on('message', (message) => {
    messageHandler(client, message, cooldowns);
});

client.login(secrets.token);
