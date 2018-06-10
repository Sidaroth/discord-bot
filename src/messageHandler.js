import config from './config.json';
import { prune, hi, help } from './commands';

// TODO expand on this through some sort of "!addroletocommand prune testRole"ish system? (Realistically, how many admin only commands will be added?)
function isAllowedToExecute(member, command) {
    const restrictedToRoles = config.restrictedCommands[command];
    let allowed = true;
    if (restrictedToRoles) {
        allowed = false;
        restrictedToRoles.every((role) => {
            if (member.roles.find('name', role)) {
                allowed = true; // The user has the required role, we'll allow the execution of the command.
                return false;
            }
            return true;
        });
    }

    return allowed;
}

const messageHandler = function messageHandlerFunc(message) {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    let reply = '';

    if (!isAllowedToExecute(message.member, command)) {
        return;
    }

    switch (command) {
        case 'hi':
            reply = hi(message.author);
            break;

        case 'prune':
            reply = prune(message.channel, args);
            break;

        case 'help': {
            message.reply(help(args[0]));
            break;
        }
    }

    if (reply !== '') {
        message.channel.send(reply);
    }
};

export default messageHandler;
