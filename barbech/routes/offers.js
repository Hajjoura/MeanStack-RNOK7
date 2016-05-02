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

/* GET home page. */
router.get('/', function(req, res, next) {
    models.offer.find({}, function(err, offers){
        res.json(offers);
    });
});

router.get('/:id', function(req, res, next) {
    models.offer.findById(req.params.id, function(err, offer){
        if(err) res.json(err);
        res.json(offer);
    });
});

router.get('/advancedsearch/:keywords', function(req, res, next) {
	models.offer.find( {$text: {$search : req.params.keywords}}, {score: {$meta: 'textScore'}}).sort({score: {$meta: "textScore"}}).exec(function(err, offers) {
		res.json(offers);
	});
});

module.exports = router;
