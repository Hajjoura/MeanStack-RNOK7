'use strict';

/* Controllers */

angular.module('angular-client-side-auth')
.controller('NavCtrl', ['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {
    $scope.user = Auth.user;
    $scope.userRoles = Auth.userRoles;
    $scope.accessLevels = Auth.accessLevels;

    $scope.logout = function() {
        Auth.logout(function() {
            $location.path('/login');
        }, function() {
            $rootScope.error = "Failed to logout";
        });
    };
}]);

angular.module('angular-client-side-auth')
.controller('LoginCtrl',
['$rootScope', '$scope', '$location', '$window', 'Auth', function($rootScope, $scope, $location, $window, Auth) {

    $scope.rememberme = true;
    $scope.login = function() {
        Auth.login({
                username: $scope.username,
                password: $scope.password,
                rememberme: $scope.rememberme
            },
            function(res) {
                $location.path('/');
            },
            function(err) {
                $rootScope.error = "Failed to login";
            });
    };

    $scope.loginOauth = function(provider) {
        $window.location.href = '/auth/' + provider;
    };
}]);

angular.module('angular-client-side-auth')
.controller('RegisterCtrl',
['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {
    $scope.role = Auth.userRoles.user;
    $scope.userRoles = Auth.userRoles;
    $scope.selectedPlace = "";

    // Place list
    $scope.places = [
      {name:'Tunis',ind: 'Tunis'},
      {name:'Ariana',ind: 'Ariana'}
    ];

    $scope.register = function() {
        Auth.register({
                username: $scope.username,
                password: $scope.password,
                role: $scope.role,
                place: $scope.selectedPlace
            },
            function() {
                $location.path('/profile');
            },
            function(err) {
                $rootScope.error = err;
            });
    };
}]);

angular.module('angular-client-side-auth')
.controller('AdminCtrl',
['$rootScope', '$scope', 'Users', 'Auth', function($rootScope, $scope, Users, Auth) {
    $scope.loading = true;
    $scope.userRoles = Auth.userRoles;

    Users.getAll(function(res) {
        $scope.users = res;
        $scope.loading = false;
    }, function(err) {
        $rootScope.error = "Failed to fetch users.";
        $scope.loading = false;
    });

}]);

angular.module('angular-client-side-auth')
.controller('OfferCtrl',
['$rootScope', '$scope', 'Offers', 'Auth','$stateParams', function($rootScope, $scope, Offers, Auth,$stateParams) {
    var searchText = $stateParams.searchText;

    $scope.loading = true;
    $scope.searchText = searchText;

    if(searchText == undefined) {
      Offers.getAll(function(res) {
          $scope.offers = res;
          $scope.loading = false;
      }, function(err) {
          $rootScope.error = "Failed to fetch offers.";
          $scope.loading = false;
      });
    } else {
      Offers.find(searchText,function(res) {
          $scope.offers = res;
          $scope.loading = false;
      }, function(err) {
          $rootScope.error = "Failed to fetch offers.";
          $scope.loading = false;
      });
    }

    $scope.find = function() {
      Offers.find($scope.searchText,function(res) {
          $scope.offers = res;
          $scope.loading = false;
      }, function(err) {
          $rootScope.error = "Failed to fetch offers.";
          $scope.loading = false;
      });
    };
}]);


angular.module('angular-client-side-auth')
.controller('OfferPlaceCtrl',
['$rootScope', '$scope', 'Offers', 'Auth','$stateParams', function($rootScope, $scope, Offers, Auth,$stateParams) {
    var searchText = $stateParams.searchText;

    $scope.loading = true;

    Offers.findByPlace(function(res) {
        $scope.offers = res;
        $scope.loading = false;
    }, function(err) {
        $rootScope.error = "Failed to fetch offers.";
        $scope.loading = false;
    });

}]);

// Custom search controller
angular.module('angular-client-side-auth')
.controller('OfferAdvancedSearchCtrl',
['$rootScope', '$scope', 'Offers', 'Auth','$stateParams', function($rootScope, $scope, Offers, Auth,$stateParams) {
    $scope.searchTitle = "";
    $scope.searchDescription = "";
    $scope.searchPlace = "";

    $scope.find = function() {
      Offers.findAdvancedOffers($scope.searchTitle,$scope.searchDescription,$scope.searchPlace,function(res) {
          $scope.offers = res;
          $scope.loading = false;
      }, function(err) {
          $rootScope.error = "Failed to fetch offers.";
          $scope.loading = false;
      });
    };
}]);


angular.module('angular-client-side-auth')
.controller('HomeCtrl',
['$rootScope', '$scope', 'Auth', '$location', function($rootScope, $scope, Auth, $location) {
    $scope.searchText = "";

    $scope.find = function() {
      $location.path('/offers_find/'+$scope.searchText);
    };
}]);
