import Discord from 'discord.js';
import secrets from '../secrets.json';
import MessageHandler from './messageHandler';

const client = new Discord.Client();
const messageHandler = new MessageHandler();

client.on('ready', () => {
    console.log('Bot connected succesfully!');
});

client.on('message', (message) => {
    messageHandler.handleMessage(message);
});

client.login(secrets.token);
