const users = require('../routes/users');
const accounts = require('../routes/accounts');
const express = require('express');

module.exports = function(app){
app.use(express.json());
app.use('/users',users);
app.use('/accounts',accounts);
}
