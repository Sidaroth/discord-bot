import secrets from '../../secrets.json';

const pgp = require('pg-promise')();

const details = {
    database: secrets.dbName,
    user: secrets.dbUser,
    password: secrets.dbPW,
};

const db = pgp(details);

export default db;
