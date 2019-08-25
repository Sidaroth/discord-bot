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
    name: 'music',
    description: 'Description of music commands.',
    cooldown: 5,
    guildOnly: false,
    execute: async (message, args) => {
        const response =
            'The bot now supports various musical commands!\nUse `!summon` to have the bot join you in a room.\n' +
            '`!volume` may be used to adjust the volume (0-100).\n' +
            '`!play`, `!pause`, `!resume` can be used to control the bot as well.\n' +
            '`!queue <youtube url>` can be used with one, or more, youtube urls to queue songs for play.\n' +
            '`!skip` can be used to skip the current song, and move to the next in the queue.\n' +
            '`!stop` and `!dc` can be used to make the bot stop and disconnect completely.';
        message.channel.send(response);
    },
};
