var Xray = require('x-ray');
var x = Xray();

function driver(credentials, jar, isLoggedIn) {

 function reqFN(url, fn){
     request({
        url: url,
        jar: jar,
      }, function(err, res, body) {
        if(err) return fn(err);
        return fn(null, body);
      });
  }

  return function plugin(xray) {
    xray.request = function(url, fn) {
      if(isLoggedIn(jar)){
        reqFN(url, fn);
      }else{
        request.post({
            jar: jar,
            followAllRedirects: true,
            uri: 'https://mysite.com/login',
            headers: {
              'content-type': 'application/x-www-form-urlencoded'
            },
          body: require('querystring').stringify(credentials)
        }, function(err, res, body){
          if(err) return fn(err);
          reqFN(url, fn);
        });
      }
    };
    return xray;
  };
}

var myJar = request.jar();

xray("https://mysite.com")
  .use(driver({ //These credentials should match the intput names on the login form
     username: 'username',
      password: 'password'
  }, myJar, function(jar){
    //A custom function to signal based on looking at the cookies when a user is logged in or not.
    //This is used so we don't need to login for all subsequent requests.
    return (jar.getCookieString("https://mysite.com").indexOf("<loginneedle>") !== -1);
  }))

  .select([{
    //stuffz
  }])
  .paginate('.paginate')
  .limit(10)
  .write(process.stdout);
