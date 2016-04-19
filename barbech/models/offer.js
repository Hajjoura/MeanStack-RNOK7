var mongoose = require('../config/db');

var OfferSchema = mongoose.Schema({
    title: String,
    description: String,
    place: String,
    company: String,
    source: String,
    source_id: String
});

module.exports = mongoose.model('Offer', OfferSchema);