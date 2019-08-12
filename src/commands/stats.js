import Discord from 'discord.js';
import { db } from '../db/connection';

module.exports = {
    name: 'stats',
    description: 'Shows you everything the robotic overlord knows about you. (In DMs)',
    cooldown: 5,
    guildOnly: false,
    execute: async (message, args) => {
        const userId = String(message.author.id);
        db.any('SELECT * FROM userStats WHERE userId = $1', userId).then((res) => {
            if (res[0]) {
                const userData = res[0];
                const responseData = [];

                responseData.push(`**User id:** *${userId}*`);
                responseData.push(`**Experience:** *${userData.experience}*`);
                responseData.push(`**Message Count:** *${userData.messagecount}*`);

                const embed = new Discord.RichEmbed()
                    .setColor('55FFAA')
                    .setTitle('Sid\'s Server Statistics')
                    .addField('All known data about you', responseData.join('\n'));

                message.author.send(embed);
            } else {
                message.channel.send('No data was found.');
            }
        }).catch((error) => {
            console.error(error);
        });
    },
};
