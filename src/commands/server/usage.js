import db from '../../db/connection';
import config from '../../config.json';

export default {
    name: 'usage',
    description: 'Provides usage statistics for each command supported by the bot.',
    requiresArgs: false,
    execute: async (message, args) => {
        db.any('SELECT * from commandStats ORDER BY uses DESC')
            .then((res) => {
                const output = ['**Bot Usage Statistics:**'];
                let totalUses = 0;
                res.forEach((comm) => {
                    output.push(`\`${config.prefix}${comm.command}\` has been used **${comm.uses}** times!`);
                    totalUses += comm.uses;
                });

                output.push(`\n**Total commands used: ${totalUses}**`);
                message.channel.send(output.join('\n'));
            })
            .catch(error => console.error(error));
    },
};
