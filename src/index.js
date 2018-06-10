import Discord from 'discord.js';
import secrets from '../secrets.json';
import messageHandler from './messageHandler';
import commands from './commands';

const client = new Discord.Client();
client.commands = new Discord.Collection();

// Set up all exported commands from the commands folder.
commands.forEach((command) => {
    client.commands.set(command.name, command);
});

client.on('ready', () => {
    console.log('Bot connected succesfully!');
});

client.on('message', (message) => {
    messageHandler(client, message);
});

client.login(secrets.token);
