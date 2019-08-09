import config from '../config.json';

const levels = [];

// Extremely basic XP lookup table.
const calculateLevelTable = function calculateLevelTableFunc() {
    let xpRequiredForPrev = config.experience.baseXP;
    levels.push(xpRequiredForPrev);

    for (let lvl = config.levels.min; lvl <= config.levels.max; lvl += 1) {
        let reqThisLevel = Math.floor(1.1 * xpRequiredForPrev);
        if (reqThisLevel > 40000) {
            reqThisLevel = 40000;
        }

        const totalXPReq = levels[levels.length - 1] + reqThisLevel;
        levels.push(totalXPReq);

        xpRequiredForPrev = reqThisLevel;
    }
};

export {
    calculateLevelTable,
    levels,
};
