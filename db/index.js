const {Pool} = require('pg');

const pool = new Pool({
    port: 5430,
    host: 'localhost',
    password: 'klosek79',
    user: 'postgres',
    database: 'bankingDb'
});

module.exports = (text,params,callback) => {
    return pool.query(text,params,callback);
};