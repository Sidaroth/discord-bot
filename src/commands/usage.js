import { db } from '../db/connection';

module.exports = {
    name: 'usage',
    description: 'Provides usage statistics for each command supported by the bot.',
    requiresArgs: false,
    execute(message, args) {
        db.any('SELECT * from commandStats')
            .then((res) => {
                const output = ['**Bot Usage Statistics:**'];
                let totalUses = 0;
                res.forEach((comm) => {
                    output.push(`\`${comm.command}\` has been used **${comm.uses}** times!`);
                    totalUses += comm.uses;
                });

                output.push(`\n**Total commands used: ${totalUses}**`);
                message.channel.send(output.join('\n'));
            })
            .catch(error => console.error(error));
    },
};
