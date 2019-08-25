/**
 * Template containing all parameters a command may contain.
 * name:            required    string     --> How the command is executed in chat. !name
 * description:     required    string     --> Describes the functionality of the command. Used by the !help command.
 * adminRestriction:            boolean    --> Restricts access to the command to users that have admin premissions. i.e !prune is restricted.
 * aliases:                     [string]   --> Aliases allow users to execute a command by writing !alias1 instead of !name, i.e !wow instead of !armory.
 * cooldown:                    int        --> How long a user will have to wait to execute the command again.
 * guildOnly:                   boolean    --> This locks the command out of DMs. Some functionality cannot work in DMs.
 * requiresArgs:                boolean    --> Specifies whether or not the command requires an argument to work.
 * usage:                       string     --> Describes how the command is used i.e '!name <argument1> <argument2>'. Used by the !help command.
 * execute:         required    function   --> The code that runs when the command is executed.
 *
 * For a command to be executable, all required parameters must be present, and the command must be referenced in commands/index.js.
 */

module.exports = {
    name: 'name',
    description: 'description',
    adminRestriction: true,
    aliases: ['alias1'],
    cooldown: 5,
    guildOnly: false,
    requiresArgs: false,
    usage: '<argument1>',
    execute: async (message, args) => {
        // code here.
    },
};
