var express = require('express');
var router = express.Router();
var models = require('../models');
var jwt = require('jsonwebtoken');

router.post('/register', function(req, res, next) {
    //tester si username exist
    var user = new models.user({
        username: req.body.username,
        password: req.body.password,
        work: req.body.work,
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
        place: req.body.place,
		education: JSON.parse(req.body.education),
        experience:JSON.parse(req.body.experience)
    }}, {new: true}, function(err, user){
		res.json(user);
	});
    
});

router.get('/profile', function(req, res, next) {
	models.user.findById(req.user._id, function(err, user){
        return res.json(user);
    });
});

router.get('/', function(req, res, next) {
    models.user.find({}, function(err, users){
        res.json(users);
    });
});

module.exports = router;
