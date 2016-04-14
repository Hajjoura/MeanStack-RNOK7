var source = require('./source.js');
var async = require('async');
var Xray = require('x-ray');
var x = Xray();

module.exports = new function () {

  // An array which contains all the sources
  this.sources = [];

  //An array which contains the data retrieved from each source
  this.data = [];


  /*
  * Return the source by name
  * name string
  */
  this.getSourceByName = function(name) {
    for(sourceItem in this.sources) {
      source = this.sources[sourceItem];

      if(source.getName() === name) {
        return source;
      }
    }
    return null;
  }

  /*
  * Add a new source
  * name string
  * url string
  * selectors json
  */
  this.addSource = function (name,url,selectors,placeCallback)
  {
    this.sources.push(new source(name,url,selectors,placeCallback));
  }

  //Scrap the data from all the sources
  this.scrap = function(callback) {
    var that = this;

    //We use asyn to ensure that all the sources are parsed before returning the data
    async.each(that.sources, function(sourceItem, asyncCallback) {

      // Scrap the source using xray
      x(sourceItem.getUrl(), sourceItem.getSelectors())(function(err, obj) {

        //Add the result to the data array
        that.data.push({'source':sourceItem.getName(),'details':obj});

        //Call the asyn callback
        asyncCallback(err);
      })

    }, function(err){
        // if any of the file processing produced an error, err would equal that error
        if( err ) {
          // One of the iterations produced an error.
          // All processing will now stop.
          callback(that.data,err);
        } else {

          //Call the callback with all the data reteieved from the sources
          callback(that.data,null);
          console.log('All sources have been processed successfully');
        }
    });
  }
}
