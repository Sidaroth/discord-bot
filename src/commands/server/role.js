import config from '../../config.json';

export default {
    name: 'role',
    aliases: ['assign', 'join'],
    description: 'Asks the bot to assign you to a specified role. (If allowed)',
    cooldown: 5,
    requiresArgs: true,
    guildOnly: true,
    usage: `<role>\nAssignable roles are: ${config.assignableRoles.join(', ')}`,
    execute: async (message, args) => {
        const newRole = args[0];

        const isAssignableRole = config.assignableRoles.find(r => r.toLowerCase() === newRole.toLowerCase());
        const role = message.guild.roles.find(r => r.name.toLowerCase() === newRole.toLowerCase());

        if (!isAssignableRole || !role) {
            return message.channel.send(`That doesn't look like a valid role. Valid roles are \`${config.assignableRoles.join(', ')}\``);
        }

        if (message.member.roles.has(role.id)) {
            return message.channel.send(`You're already assigned as \`${role.name}\`.`);
        }

        message.member.addRole(role);
        return message.channel.send(`Succesfully assigned you to \`${role.name}\``);
    },
};
