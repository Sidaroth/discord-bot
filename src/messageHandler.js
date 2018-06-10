import config from './config.json';

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

const messageHandler = function messageHandlerFunc(client, message) {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).split(/ +/);
    const commandKey = args.shift().toLowerCase();

    if (!client.commands.has(commandKey)) return;
    const command = client.commands.get(commandKey);
    if (!isAllowedToExecute(message.member, command)) return;

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.channel.send('There was an error trying to execute that command. Notify admin.');
    }
};

export default messageHandler;
