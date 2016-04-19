var User
    , _ =               require('underscore')
    , passport =        require('passport')
    , LocalStrategy =   require('passport-local').Strategy
    , TwitterStrategy = require('passport-twitter').Strategy
    , FacebookStrategy = require('passport-facebook').Strategy
    , GoogleStrategy = require('passport-google').Strategy
    , LinkedInStrategy = require('passport-linkedin').Strategy
    , check =           require('validator').check
    , userRoles =       require('../../client/js/routingConfig').userRoles;


var FACEBOOK_APP_ID = "216058658748971";
var FACEBOOK_APP_SECRET = "f00692f798f8b11f97fd748da16f95df";

var users = [
    {
        id:         1,
        username:   "user",
        password:   "123",
        role:   userRoles.user,
        place: "Tunis"
    },
    {
        id:         2,
        username:   "admin",
        password:   "123",
        role:   userRoles.admin
    }
];

module.exports = {
    addUser: function(username, password, role,place, callback) {
        if(this.findByUsername(username) !== undefined)  return callback("UserAlreadyExists");

        // Clean up when 500 users reached
        if(users.length > 500) {
            users = users.slice(0, 2);
        }

        var user = {
            id:         _.max(users, function(user) { return user.id; }).id + 1,
            username:   username,
            password:   password,
            role:       role,
            place: place
        };
        
        users.push(user);
        callback(null, user);
    },

    findOrCreateOauthUser: function(provider, providerId,profile) {
       console.log(profile);
        var user = module.exports.findByProviderId(provider, providerId);
        if(!user) {
            user = {
                id: _.max(users, function(user) { return user.id; }).id + 1,
                username: profile.displayName, // Should keep Oauth users anonymous on demo site
                role: userRoles.user,
                provider: provider
            };
            user[provider] = providerId;
            users.push(user);
        }

        return user;
    },

    findAll: function() {
        return _.map(users, function(user) { return _.clone(user); });
    },

    findById: function(id) {
        return _.clone(_.find(users, function(user) { return user.id === id }));
    },

    findByUsername: function(username) {
        return _.clone(_.find(users, function(user) { return user.username === username; }));
    },

    findByProviderId: function(provider, id) {
        return _.find(users, function(user) { return user[provider] === id; });
    },

    validate: function(user) {
        check(user.username, 'Username must be 1-20 characters long').len(1, 20);
        check(user.password, 'Password must be 5-60 characters long').len(5, 60);
        check(user.username, 'Invalid username').not(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);

        // TODO: Seems node-validator's isIn function doesn't handle Number arrays very well...
        // Till this is rectified Number arrays must be converted to string arrays
        // https://github.com/chriso/node-validator/issues/185
        var stringArr = _.map(_.values(userRoles), function(val) { return val.toString() });
        check(user.role, 'Invalid user role given').isIn(stringArr);
    },

    localStrategy: new LocalStrategy(
        function(username, password, done) {

            var user = module.exports.findByUsername(username);

            if(!user) {
                done(null, false, { message: 'Incorrect username.' });
            }
            else if(user.password != password) {
                done(null, false, { message: 'Incorrect username.' });
            }
            else {
                return done(null, user);
            }

        }
    ),

    twitterStrategy: function() {
        return new TwitterStrategy({
            consumerKey: "tG6ffUGOREygZ8XMyWgx0TGgC",
            consumerSecret: "FFQ7XdJK10zAxUe7Kp4RLOG9hX232oK8myvLwLwtLIlXlMkp4S",
            callbackURL: 'http://127.0.0.1:3000/auth/twitter/callback'
        },
        function(token, tokenSecret, profile, done) {
            var user = module.exports.findOrCreateOauthUser(profile.provider, profile.id,profile);
            done(null, user);
        });
    },

    facebookStrategy: function() {
        return new FacebookStrategy({
            clientID: FACEBOOK_APP_ID,
            clientSecret: FACEBOOK_APP_SECRET,
            callbackURL: "http://127.0.0.1:3000/auth/facebook/callback"
        },
        function(accessToken, refreshToken, profile, done) {

            var user = module.exports.findOrCreateOauthUser(profile.provider, profile.id,profile);
            done(null, user);
        });
    },

    googleStrategy: function() {

        return new GoogleStrategy({
            returnURL: process.env.GOOGLE_RETURN_URL || "http://localhost:3000/auth/google/return",
            realm: process.env.GOOGLE_REALM || "http://localhost:3000/"
        },
        function(identifier, profile, done) {
            var user = module.exports.findOrCreateOauthUser('google', identifier, profile);
            done(null, user);
        });
    },

    linkedInStrategy: function() {
        return new LinkedInStrategy({
            consumerKey: "77ao0al9hg30im",
            consumerSecret: "gCJyR8bEpqjx1VQP",
            callbackURL: "http://127.0.0.1:3000/auth/linkedin/callback"
          },
           function(token, tokenSecret, profile, done) {
            var user = module.exports.findOrCreateOauthUser('linkedin', profile.id, profile);
            done(null,user);
          }
        );
    },
    serializeUser: function(user, done) {
        done(null, user.id);
    },

    deserializeUser: function(id, done) {
        var user = module.exports.findById(id);

        if(user)    { done(null, user); }
        else        { done(null, false); }
    }
};