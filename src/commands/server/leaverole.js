import config from '../../config.json';

module.exports = {
    name: 'leaverole',
    aliases: ['unassign', 'leave'],
    description: 'Asks the bot to remove you from a specified role.',
    cooldown: 5,
    requiresArgs: true,
    guildOnly: true,
    usage: `<role>\nRemovable roles are: ${config.assignableRoles.join(', ')}`,
    execute: async (message, args) => {
        const newRole = args[0];

        const isAssignableRole = config.assignableRoles.find(r => r.toLowerCase() === newRole.toLowerCase());
        const role = message.guild.roles.find(r => r.name.toLowerCase() === newRole.toLowerCase());

        if (!isAssignableRole || !role) {
            return message.channel.send(`That doesn't look like a valid role. Valid roles are \`${config.assignableRoles.join(', ')}\``);
        }

        if (!message.member.roles.has(role.id)) {
            return message.channel.send(`You are not assigned as \`${role.name}\`.`);
        }

        message.member.removeRole(role);
        return message.channel.send(`Succesfully removed you from \`${role.name}\``);
    },
};
