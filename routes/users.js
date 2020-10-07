const autocatch = require('../helpers/autocatch');
const express = require('express');
const query = require('../db/index');
const {Client} = require('pg');

const router = express.Router();

router.post('/login',autocatch(async(req,res)=>{
    const queryString = 'SELECT * FROM users WHERE username = $1';
    const result = await query(queryString,[req.body.username]);
    if(result.rows[0]) {
        const {pw} = result.rows[0];
        if(pw === req.body.password) {           
            res.send(result.rows[0]);
        }
        else {
            res.send('Wrong password');
        }
    }
    else {
        res.send('Not found');
    }
}));

router.post('/register',async(req,res)=>{
    const queryString = 'SELECT * FROM users WHERE username = $1';
    const result = await query(queryString,[req.body.username]);
    if(result.rows[0]) {
        res.send('Name already taken');
    }
    else {
        const client = new Client({
            port: 5430,
            host: 'localhost',
            password: 'klosek79',
            user: 'postgres',
            database: 'bankingDb'
        });
        client.connect();
        const queryString = 'INSERT INTO users(username,pw) VALUES($1,$2)';
        const result = await client.query(queryString,[req.body.username,req.body.password]);
        client.end();
        res.send(`Operation ${result.command} performed succesfuly. Number of rows changed: ${result.rowCount}`);
    }
});

module.exports = router;
