import { db } from '../db/connection';

const updateStats = function updateStatsFunc(commandName) {
    db.task((task) => {
        db.any('SELECT * FROM commandstats')
            .then((res) => {
                const commandStats = res.find(stat => stat.command === commandName);
                if (!commandStats) {
                    db.none('INSERT INTO commandstats(command, uses) VALUES ($1, $2)', [commandName, 1]);
                } else {
                    db.none('UPDATE commandstats SET uses = $1 WHERE command = $2', [commandStats.uses + 1, commandName]);
                }
            });
    }).catch((error) => {
        console.error(error);
    });
};

export default updateStats;
