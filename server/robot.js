var barbech = require('./services/barbech.js');
var Xray = require('x-ray');
var x = Xray();
var offerModel = require('./models/offer.js');
var mongoose = require('mongoose');
var async = require('async');

//Define the selectors used to retrieve the job offers from tanit website
var tanitSelectors = {
  items: x('.offre',[{
    link: '.detail a@href',
    title: '.detail a',
    campany:'#companytitle',
    description: '.descriptionjob'
  }])
};

tanitPlaceCallback = function(placeText) {
  return placeText;
}

//Add a new source : TanitJobs
// barbech.addSource('Tanit',
//                   'http://tanitjobs.com/search-results-jobs/?action=search&listing_type[equal]=Job&keywords[all_words]=&JobCategory[multi_like][]=',
//                   tanitSelectors,tanitPlaceCallback);


// ******************************* Keeyjob details *****************************************/

var keeJobSelectors = {
  items: x('.post',[{
    link: '.content .span8 a@href',
    title: '.content .span8',
    campany:'.content .span12 a',
    description: '.content .span12 p',
    place: x('.content .span8 a@href', 'meta[property="og:title"]@content'),
  }])
};

keeyjobPlaceCallback = function(placeText) {
  var res = placeText.split("-");
  return res[1].replace('Tunisie ','');
}

barbech.addSource('Keejob','http://www.keejob.com/search/jobs/advanced/results/?country=788&localities=%5B1%5D',keeJobSelectors,keeyjobPlaceCallback);

// ******************************* Keeyjob details *****************************************/

tayaraPlaceCallback = function(placeText) {
  return placeText;
}

var tayaraSelectors = {
  items: x('.item',[{
    link: '.item-info a@href',
    title: '.item-info',
    campany: x('.item-info a@href', '.user-info-divider h3'),
    description: x('.item-info a@href', '.fs16'),
    place: x('.item-info a@href', '.user-info-divider div:last-child'),
  }])
};

barbech.addSource('Tayara',"http://www.tayara.tn/tunisie/offres_d'emploi-%C3%A0_vendre",tayaraSelectors,tayaraPlaceCallback);

/**
* Add all the sources
*
*/

//Scrap all the sources
barbech.scrap(function(obj,err){

  var i =0;

  //We use asyn to ensure that all the data are inserted before closing the database connection
  async.each(obj, function(value, asyncSourcesCallback) {
    var sourceInstance = barbech.getSourceByName(value.source);

    var items = value['details']['items'];
      // Iterate all the items
      async.each(items, function(item, asyncitemsCallback) {

          // Retrieve place
          placeCallback = sourceInstance.getPlaceCallback();
          placeValue = placeCallback(item.place);

          // Save the data
          offerModel.addOffer(item.title,item.description,placeValue,item.link,item.campany,value.source,i,
            function(error,data){

              if(error) {
                console.log(error);
              }

              i++;

              // Callback for the items
              asyncitemsCallback();
            }
          );
      }, function(err){

        // Callback for the asyn sources
        asyncSourcesCallback();

          if( err ) {
            console.log(err);
          }
      });
  }, function(err){

      // Disconnect mangoose
      mongoose.disconnect();

      if( err ) {
        console.log(err);
      } else {
        console.log('All data imported');
      }
  });
});
