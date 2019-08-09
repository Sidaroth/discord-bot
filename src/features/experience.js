import config from '../config.json';
import { db } from '../db/connection';

const calcXpGain = function calcXpGainFunc(messageLength) {
    return config.experience.gain.message + messageLength * config.experience.gain.character;
};

const updateExperience = function updateExperienceFunc(user) {
    db.any('SELECT * FROM experience')
        .then((res) => {
            const userXp = res.find(val => val.userId === user.id);
            const xpGain = calcXpGain(user.lastMessage.content.length);

            console.log(userXp, xpGain);

            if (!userXp) {
                db.none('INSERT INTO experience(userId, experience) VALUES ($1, $2)', [user.id, xpGain]);
            } else {
                db.none('UPDATE experience SET experience = $1 WHERE userId = $2', [userXp.experience + xpGain, userXp.userId]);
            }
        })
        .catch((error) => {
            console.error(error);
        });
};

export default updateExperience;
