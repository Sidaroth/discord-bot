import config from './config.json';

export default class MessageHandler {
    constructor() {
        this.restrictedCommands = config.restrictedCommands;
    }

    handleMessage(message) {
        if (!message.content.startsWith(config.prefix) || message.author.bot) return;

        const args = message.content.slice(config.prefix.length).split(/ +/); // split on 1 or more spaces (yay regex...).
        const command = args.shift().toLowerCase();
        let reply = '';

        switch (command) {
            case 'hi':
                if (this.isAllowedToExecute(message.member, command)) {
                    reply = `Hi ${message.author}!`;
                }
                break;

            case 'prune':
                if (this.isAllowedToExecute(message.member, command)) {
                    reply = 'Prune command...';
                }

                break;
        }

        if (reply !== '') {
            message.channel.send(reply);
        }
    }

    isAllowedToExecute(member, command) {
        const restrictedToRoles = this.restrictedCommands[command];
        let allowed = true;
        if (restrictedToRoles) {
            allowed = false;
            restrictedToRoles.every((role) => {
                if (member.roles.find('name', role)) {
                    console.log(`found ${role}`);
                    allowed = true; // The user has the required role, we'll allow the execution of the command.
                    return false;
                }
                return true;
            });
        }

        return allowed;
    }
}
