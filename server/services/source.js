module.exports = function (name,url,selectors,placeCallback) {

  this.name = name;
  this.url = url;
  this.selectors = selectors;
  this.placeCallback = placeCallback;

  this.getName = function ()
  {
    return this.name;
  }

  this.getUrl = function ()
  {
    return this.url;
  }

  this.getSelectors = function ()
  {
    return this.selectors;
  }

  this.getPlaceCallback = function ()
  {
    return this.placeCallback;
  }
}
