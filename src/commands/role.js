import config from '../config.json';

/**
 * TODO: Add a way to remove an assigned role if it's assignable. (Maybe as aseperate command.) 
 * use message.member.removeRole(role);
 **/ 
module.exports = {
    name: 'role',
    aliases: ['assign'],
    description: 'Asks the bot to assign you to a specified role. (If allowed)',
    cooldown: 5,
    requiresArgs: true,
    guildOnly: true,
    usage: `<role>\nAssignable roles are: ${config.assignableRoles.join(', ')}`,
    execute: async (message, args) => {
        const newRole = args[0];
        
        if(!config.assignableRoles.find((role) => role.toLowerCase() === newRole.toLowerCase())) {
            return message.channel.send(`That doesn't look like a valid role. Valid roles are \`${config.assignableRoles.join(', ')}\``);
        }

        const role = message.guild.roles.find(role => role.name.toLowerCase() === newRole.toLowerCase());
        if(role) {
            // console.log(message.member.user);
            if(message.member.roles.has(role.id)) {
                return message.channel.send(`You're already assigned as \`${role.name}\`.`);
            }

            message.member.addRole(role);
            return message.channel.send(`Succesfully assigned you to \`${role.name}\``);
        }
    },
};
