var offerModel = require('./models/offer.js')
var FB = require("fb");
var mongoose = require('mongoose');

FB.options ({'appId' : "1677506365854637"})
FB.options({ 'appSecret' : '7ea79627746bd10afe9c4ae37c59fef6' })
FB.options({'appNamespace' : "Barbech"})
FB.setAccessToken('CAAX1ruMLk60BAN45ccpya2T2fZCtNshpCKfKqVfAj0ogZAGnAvgwfZAEVFP6x9QBQxBfGcNoIFNL6UW4SKNa4e1o8HcTFpPYcu6gtoEPbk0kGsb12BM1mln9ioMXj63IZAAQ1nxhW7RCksJzECx8u6rCnZC0V3MzG7g7GxXUZCY9ceqljNQV1Pr3Bsw18BKfgZD');

FB.api('/tunisietravail?fields=posts{message,full_picture,comments}', function (result) {
  if (!result || result.error) {
    console.log(!result ? 'error occurred' : res.error);
    return;
  }

  for(var index in result['posts']['data']){
    var data = result['posts']['data'][index];
    var message = data['message'];

    if(message != undefined) {
      var details = message.split("\n");
      offerModel.addOffer(details[0],"",'',details[1],"", "facebook",index,function(error,data){
      });
    }
  }

  console.log("Offers imported from facebook");
});
