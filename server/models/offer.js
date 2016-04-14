var mongoose      = require('mongoose');

var Schema    = mongoose.Schema;

// Declare Schema for table Offer
var offerSchema = new Schema({
      title: String,
      description: String,
      place: String,
      link: String,
      company: String,
      source: String,
      source_id: String
});

mongoose.connect('mongodb://localhost/Barbech');
var Offer = mongoose.model('Offer', offerSchema);

module.exports = {

    // Add a new offer
    addOffer: function (title, description, place, link, company,source,source_id,callback) {

        // First we should check if the offer exists in our database, if yes return an error
        this.findBySourceId(source,source_id,function(exists){

            if(exists) {
              callback("Offer already exists");
            } else {

              // Store offer in MongoDb
              var data = {
                title: title,
                description: description,
                place: place,
                link: link,
                company: company,
                source: source,
                source_id: source_id
              };

              var offer = new Offer(data);

              // Save the offer
              offer.save(function (error, data) {
                  if (error) {
                      callback(error);
                  }
                  else {
                      callback(null, data);
                  }
              });
            }
        });
    },

    // Find offer by source and source_id
    findBySourceId: function (source, source_id,callback) {
        Offer.findOne({ source: source, source_id:source_id}, function (error, offer) {

            if (!error) {
                if (offer) {
                  callback(true);
                } else {
                    callback(false);
                }
            } else {
              callback(false);
            }
        });
    },

    findByText:function(text,callback){
      var searchText = new RegExp(text, "i");

      Offer.find({$or:[{title: searchText},{description: searchText}]}, function(err, offers) {
        callback(offers);
      });
    },

    findByPlace:function(text,callback){
      var searchText = new RegExp(text, "i");

      Offer.find({place: searchText}, function(err, offers) {
        callback(offers);
      });
    },

    advancedSearch:function(title,description,place,callback){
      var searchTitle = new RegExp(title, "i");
      var searchDesc = new RegExp(description, "i");
      var searchPlace = new RegExp(place, "i");

      Offer.find({title: searchTitle,description:searchDesc,place: searchPlace}, function(err, offers) {
        callback(offers);
      });
    },

    // Return all the offers
    getAllOffer: function(callback){
      Offer.find({}, function (error, offers) {
          callback(offers);
      });
    }
};
