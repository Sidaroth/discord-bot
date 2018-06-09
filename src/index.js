import Discord from 'discord.js';
import config from './config.json';
import secrets from '../secrets.json';
import messageHandler from './messageHandler';

const client = new Discord.Client();
const prefix = config.prefix;

client.on('ready', () => {
    console.log('Bot connected succesfully!');
});


client.on('message', (message) => {
    messageHandler(message);
});

client.login(secrets.token);