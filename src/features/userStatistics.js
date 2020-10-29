import config from '../config.json';
import db from '../db/connection';

const calcXpGain = function calcXpGainFunc(messageLength = 0) {
    return config.experience.gain.message + messageLength * config.experience.gain.character;
};

const updateUserStatistics = function updateUserStatisticsFunc(user, isCommand) {
    db.task((t) => {
        db.any('SELECT * FROM userStats')
            .then((res) => {
                const userId = String(user.id); // The numeric IDs are outside of integer scope, easier to deal with as strings in the DB.
                const userData = res.find(val => val.userid === userId);
                const xpGain = calcXpGain(user.lastMessage?.content?.length) * (isCommand) + 1; // bonus XP if it's a bot command.

                if (!userData) {
                    // If this is the first time we see this UserId, we insert a fresh set of values.
                    db.none('INSERT INTO userStats(userId, experience, messageCount) VALUES ($1, $2, $3)', [userId, xpGain, 1]);
                } else {
                    db.none('UPDATE userStats SET experience = $1, messageCount = $2 WHERE userId = $3', [userData.experience + xpGain, (userData.messagecount || 0) + 1, userId]);
                }
            });
    }).catch((error) => {
        console.error(error);
    });
};

export default updateUserStatistics;
