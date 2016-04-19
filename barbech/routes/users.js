var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET home page. */
router.post('/register', function(req, res, next) {
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

module.exports = router;
