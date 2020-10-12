const autocatch = require('../helpers/autocatch');
const express = require('express');
const query = require('../db/index');
const {Client} = require('pg');
const jwt = require('jsonwebtoken');
const config = require('config');

const router = express.Router();

router.post('/login',autocatch(async(req,res)=>{
    const queryString = 'SELECT * FROM users WHERE username = $1';
    const result = await query(queryString,[req.body.username]);
    if(result.rows[0]) {
        const {pw,id} = result.rows[0];
        if(pw === req.body.password) {
            const queryString = `SELECT a.id, b.id FROM users a
            INNER JOIN accounts b
            ON (a.id = b.user_id)
            WHERE a.id = $1` 
            const accounts = await query(queryString,[id]); 
            const token = jwt.sign({_accounts: accounts.rows, _username: result.rows[0].username}, config.get('tempSecret'));      
            res.status(200).send(token);
        }
        else {
            res.send('Wrong password');
        }
    }
    else {
        res.send('Not found');
    }
}));

router.post('/register',autocatch(async(req,res)=>{
    const queryString = 'SELECT * FROM users WHERE username = $1';
    const result = await query(queryString,[req.body.username]);
    if(result.rows[0]) {
        res.send('Name already taken');
    }
    else {
        const client = new Client();
        client.connect();
        const queryString = 'INSERT INTO users(username,pw) VALUES($1,$2)';
        const result = await client.query(queryString,[req.body.username,req.body.password]);
        client.end();
        res.send(`Operation ${result.command} performed succesfuly. Number of rows changed: ${result.rowCount}`);
    }
}));

module.exports = router;
