import Discord from 'discord.js';
import secrets from '../secrets.json';
import messageHandler from './messageHandler';

const client = new Discord.Client();

client.on('ready', () => {
    console.log('Bot connected succesfully!');
});

client.on('message', (message) => {
    messageHandler(message);
});

client.login(secrets.token);
