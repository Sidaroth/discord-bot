import { db } from '../db/connection';
import config from '../config.json';
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

        db.any('SELECT experience FROM experience WHERE userid = $1', [userId]).then((res) => {
            let level = 0;
            let xp = 0;

            if (res[0] && res[0].experience !== undefined) {
                level = calculateLevel(res[0].experience);
                xp = res[0].experience;
            }

            message.channel.send(`You've earned a total of \`${xp}\` XP. You are level \`${level}\`!\nYou need a total of \`${levels[level]} (${levels[level] - xp} remaining)\` XP to hit level \`${level + 1}\`.`);
        }).catch((error) => {
            console.error(error);
        });
    },
};
