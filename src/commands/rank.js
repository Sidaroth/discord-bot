import { db } from '../db/connection';
import { levels } from '../utils/calculateLevelTable';
import { findLast } from 'lodash';

const calculateLevel = function calculateLevelFunc(experience) {
    const level = levels.indexOf(findLast(levels, xpReq => xpReq < experience)) + 1;

    return level;
};

module.exports = {
    name: 'rank',
    description: 'Shows you your level, rank, xp on the server.',
    aliases: ['xp'],
    cooldown: 5,
    execute: async (message, args) => {
        const userId = String(message.author.id);

        db.any('SELECT * FROM userStats ORDER BY experience DESC')
            .then((res) => {
                let level = 0;
                let xp = 0;
                const rank = res.findIndex(u => u.userid === userId);

                if (rank !== -1) {
                    const userData = res[rank];
                    level = calculateLevel(userData.experience);
                    xp = userData.experience;
                }

                let response = `You've earned a total of \`${xp}\` XP. You are level \`${level}\`!\nYou need a total of \`${
                    levels[level]
                } (${levels[level] - xp} remaining)\` XP to hit level \`${level + 1}\`.`;

                if (rank !== -1) {
                    response = response.concat(`\nYou are ranked as \`#${rank + 1}\` on the shitpost leaderboards! Great job!`);
                }

                message.channel.send(response);
            })
            .catch((error) => {
                console.error(error);
            });
    },
};
