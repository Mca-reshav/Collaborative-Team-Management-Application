const express = require('express');

module.exports.global = [
    express.json(), // parse json post response,
    express.urlencoded({extended:true}),
    //require('./cors.mw')
];


module.exports.one = {
    validate : require('./joi.mw'),
    webAuth: require('./auth.mw'),
    _404 : require('./404.mw'),
    role : require('./role.mw')
}