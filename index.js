const express = require('express');
const config = require('config');
const app = express();
const testroute = require('./routes/users');

app.use(express.json());
app.use('/test',testroute);
//Wersja tymczasowa
app.use(function(err,req,res,next){
    res.status(500).send('Something went wrong');
})

app.listen(config.get('port'),()=>{
    console.log(`Listening on port: ${config.get('port')}`);
})