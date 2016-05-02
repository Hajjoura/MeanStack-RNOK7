var express = require('express');
var router = express.Router();
var models = require('../models');
var randtoken = require('rand-token');
var nodemailer = require('nodemailer');
//var email = require('emailjs');
var flash = require('connect-flash');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({msg: "Welcome"});
});

module.exports = router;
