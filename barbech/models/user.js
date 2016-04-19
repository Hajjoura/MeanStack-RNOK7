var mongoose = require('../config/db');

var UserSchema = mongoose.Schema({
    username: String,
    password: String,
    work: String,
    place: String,
 /*  education: [{
        date_start: String,
        date_end: String,
        description: String,
        place: String
    }],
    experience: [{
        date_start: String,
        date_end: String,
        description: String,
        place: String
    }],*/
    admin: Boolean
});

module.exports = mongoose.model('User', UserSchema);