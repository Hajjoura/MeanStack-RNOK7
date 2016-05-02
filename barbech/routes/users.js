var express = require('express');
var router = express.Router();
var models = require('../models');
var jwt = require('jsonwebtoken');

var randtoken = require('rand-token');
var nodemailer = require('nodemailer');
//var email = require('emailjs');



router.post('/register', function(req, res, next) {
    //tester si username exist
    var user = new models.user({
        username: req.body.username,
        password: req.body.password,
        work: req.body.work,
		mail: req.body.mail,
        place: req.body.place,
        admin: false
    });
    user.save(function(err, u){
        if(err) res.json(err);
        res.json(u);
    })
});


router.use(function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, require('../config/jwt'), function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                req.decoded = decoded;
                req.user = decoded._doc;
                next();
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

router.put('/updateresume', function(req, res, next) {
    models.user.findByIdAndUpdate(req.body.id, {$set: {
        work: req.body.work,
		mail: req.body.mail,
        place: req.body.place,
		education: JSON.parse(req.body.education),
        experience:JSON.parse(req.body.experience)
    }}, {new: true}, function(err, user){
		res.json(user);
	});
    
});

router.get('/profile', function(req, res, next) {
	/*models.user.findById(req.user._id, function(err, user){
        return res.json(user);
    });*/
	
	
		models.user.findById(req.user._id, function(err, user){
        console.log('user');
		console.log(user);
		var search = user.work;
		console.log(search);
		models.offer.find({ 
			                   title: new RegExp('^'+search+'$', "i")
		                 }).exec(function(err, list){
			if(err){
				console.log('1');
				console.log(err);
			}else{
				//var i = list.length;
				var email = user.mail;
  	            EmailVerif(email, list[0].description);
				console.log(list);
				res.json(user);
			}
		});
		
	
    });
	
	
});

router.get('/', function(req, res, next) {
    models.user.find({}, function(err, users){
        res.json(users);
    });
});







router.get('/sendList', function(req, res, next){

	models.user.findById(req.user._id, function(err, user){
       console.log('user');
		console.log(user);
		var search = user.work;
		models.offer.find({ description: new RegExp('^'+search+'$', "i")}).exec(function(err, list){
			if(err){
				console.log('1');
				console.log(err);
			}else{
				console.log(list);
			}
		});
		
		
    });
	
		
});
EmailVerif = function(recepient, list) {
  var transporter = nodemailer.createTransport("SMTP", {
    service: 'Gmail',
    auth: {
      user: 'hejer.krichene@gmail.com',
      pass: '//hajjoura//nahchal//'
    }
  });
  var mailOptions = {
    from: ' HEJER KRICHENE <hejer.krichene@gmail.com>',
    to: recepient,
    subject: 'New Offers By Berbech',
    text: list
  };
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      return console.log(error);
    } else {
      console.log('Email Sent');
    }
  });
}
module.exports = router;
