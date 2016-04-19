'use strict';

angular.module('angular-client-side-auth')
.factory('Auth', function($http, $cookieStore){

    var accessLevels = routingConfig.accessLevels
        , userRoles = routingConfig.userRoles
        , currentUser = $cookieStore.get('user') || { username: '', role: userRoles.public };

    console.log("Connected user",currentUser);
    $cookieStore.remove('user');

    function changeUser(user) {
        angular.extend(currentUser, user);
    }

    return {
        authorize: function(accessLevel, role) {
            if(role === undefined) {
                role = currentUser.role;
            }

            return accessLevel.bitMask & role.bitMask;
        },
        isLoggedIn: function(user) {
            if(user === undefined) {
                user = currentUser;
            }
            return user.role.title === userRoles.user.title || user.role.title === userRoles.admin.title;
        },
        register: function(user, success, error) {
            $http.post('/register', user).success(function(res) {
                changeUser(res);
                success();
            }).error(error);
        },
        login: function(user, success, error) {
            $http.post('/login', user).success(function(user){
                changeUser(user);
                success(user);
            }).error(error);
        },
        logout: function(success, error) {
            $http.post('/logout').success(function(){
                changeUser({
                    username: '',
                    role: userRoles.public
                });
                success();
            }).error(error);
        },
        accessLevels: accessLevels,
        userRoles: userRoles,
        user: currentUser
    };
});

angular.module('angular-client-side-auth')
.factory('Users', function($http) {
    return {
        getAll: function(success, error) {
            $http.get('/users').success(success).error(error);
        }
    };
});

angular.module('angular-client-side-auth')
.factory('Offers', function($http) {
    return {

        // Return all the offers
        getAll: function(success, error) {
            $http.get('/offers.json').success(success).error(error);
        },

        // Find offers by keywords
        find: function(keywords,success, error) {
            $http.get('/offersSearch.json?keywords='+keywords).success(success).error(error);
        },

        // Find offers by place for the current user
        findByPlace: function(success, error) {
            $http.get('/offersSearchPlace.json').success(success).error(error);
        },

        // Find offers by keywords
        findAdvancedOffers: function(title,description,place,success, error) {
          $http.get('/offersAdvancedSearch.json?title='+title+'&description='+description+'&place='+place).success(success).error(error);
        }
    };
});