var _ =           require('underscore')
    , offer =      require('../models/offer.js');

module.exports = {
    allOffers: function(req, res) {
      offer.getAllOffer(function(jobs){
          res.json(jobs);
      })
    },
    find: function(req, res) {
      offer.findByText(req.query.keywords,function(jobs){
        res.json(jobs);
      });
    },
    findByPlace: function(req, res) {
      offer.findByPlace(req.user.place,function(jobs){
        res.json(jobs);
      });
    },

    // Search by title description and place
    offersAdvancedSearch: function(req, res) {
      offer.advancedSearch(req.query.title,req.query.description,req.query.place,function(jobs){
        res.json(jobs);
      });
    }
};
