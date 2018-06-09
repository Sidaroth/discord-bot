import config from './config.json';

const messageHandler = function messageHandlerFunc(message) {
    if(!message.content.startsWith(config.prefix) || message.author.bot) return;
    
    const args = message.content.slice(config.prefix.length).split(/ +/);  // split on 1 or more spaces (yay regex...).
    const command = args.shift().toLowerCase();
    let reply = '';
    switch(command) {
        case 'hi': 
            reply = `Hi ${message.author}!`;
            break;
        case 'ping':
            reply = 'Pong';
            break;
        case 'server':
            reply = `Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`;
    }

    if(reply !== '') {
        message.channel.send(reply);
    }
}

export default messageHandler;