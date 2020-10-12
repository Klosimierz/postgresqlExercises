const autocatch = require('../helpers/autocatch');
const express = require('express');
const query = require('../db/index');
const {Client} = require('pg');

const router = express.Router();

router.post('/getids', autocatch(async(req,res)=>{
    const queryString = `SELECT id FROM accounts 
    WHERE user_id = 
    (SELECT id FROM users
    WHERE username = $1 )`;
    const result = await query(queryString,[req.body.username]);
    res.send(result.rows);
}));

router.post('/create', autocatch(async(req,res)=>{
    //Lock it to logged users only
    const queryString = `INSERT INTO accounts(balance,user_id)
    VALUES (0.00, $1)`;
    const result = await query(queryString,[req.body.user_id]);
    res.send(result);
}))

router.post('/transfer', autocatch(async(req,res)=>{
    const {sender,receiver,amount} = req;
    const client = await new Client();
    const queryStringA = `UPDATE accounts
    SET balance = balance - $1
    WHERE id =$2;`   
    const queryStringB = `UPDATE accounts
    SET balance = balance + $1
    WHERE id =$2;`   
    const queryStringC = `INSERT INTO transactions (amount,from_acc,to_acc)
    VALUES ($1,$2,$3);`

    await client.query('BEGIN;');
    await client.query(queryStringA,[amount,sender]);
    await client.query(queryStringB,[amount,receiver]);
    await client.query(queryStringC,[amount,sender,receiver]);
    
    result = await client('COMMIT;');

    res.send(result);
}));

module.exports = router;