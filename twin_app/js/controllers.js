angular.module('twin.controllers', [])

.controller('MenuCtrl', function($scope, localStorageService) {

})

.controller('LoginCtrl', function($scope, $http, localStorageService, $state, $window) {
    if($scope.token){
        $state.go('offers', {}, {reload: true});
    }
    $scope.login = function(){
        $http({
            method: 'POST',
            url: $scope.endpoint + 'authenticate',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: 'username=' + $scope.username + '&password='+$scope.password
        }).then(function successCallback(response) {
            if(response.data.success){
                localStorageService.set('token', response.data.token);
                $window.location.reload();
            }
        }, function errorCallback(response) {

        });
    };
})

.controller('RegisterCtrl', function($scope, $http, localStorageService, $state, $window) {
    $http({
         method: 'POST',
         url: $scope.endpoint + 'register',
         headers: {'Content-Type': 'application/x-www-form-urlencoded'},
         data: 'username=' + $scope.username + '&password='+$scope.password + '&place='+$scope.place + '&work='+$scope.work
    })
    
})

.controller('LogoutCtrl', function($scope, $http, localStorageService, $window, $state) {
    if($scope.token == null){
        $state.go('login', {}, {reload: true});
    }
    localStorageService.remove('token');
    $window.location.reload();
})

.controller('OffersCtrl', function($scope, $http) {
    $http({
        method: 'GET',
        url: $scope.endpoint + 'offers?token='+$scope.token
    }).then(function successCallback(response) {
        $scope.offers = response.data;
    }, function errorCallback(response) {

    });
})

;