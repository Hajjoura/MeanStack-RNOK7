var express = require('express');
var router = express.Router();
var models = require('../models');
var jwt = require('jsonwebtoken');

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

router.post('/addoffers', function(req, res, next) {
    var barbechoffers = new models.barbechoffers({
        title: req.body.title,
        description: req.body.description,
        company: req.body.company,
        place: req.body.place
        
    });
    barbechoffers.save(function(err, u){
        if(err) res.json(err);
        res.json(u);
    })
});

router.get('/', function(req, res, next) {
    models.barbechoffers.find({}, function(err, barbechoffers){
        res.json(barbechoffers);
    });
});

module.exports = router;