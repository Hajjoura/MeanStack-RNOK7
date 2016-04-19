var mongoose = require('../config/db');

var BarbechOfferSchema = mongoose.Schema({
    title: String,
    description: String,
    company: String,
    place: String,
});

module.exports = mongoose.model('Offerbarbech', BarbechOfferSchema);