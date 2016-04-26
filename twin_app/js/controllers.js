angular.module('twin.controllers', ["ui.map", "ui.event"])

.controller('MenuCtrl', function($scope, localStorageService) {

})
.controller('HomeCtrl', function($scope){

    $scope.lng = "0";
    $scope.accuracy = "0";
    $scope.error = "";
    $scope.model = { myMap: undefined };
    $scope.myMarkers = [];

    $scope.showResult = function () {
        return $scope.error == "";
    }

    $scope.mapOptions = {
        center: new google.maps.LatLng($scope.lat, $scope.lng),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.showPosition = function (position) {
        $scope.lat = position.coords.latitude;
        $scope.lng = position.coords.longitude;
        $scope.accuracy = position.coords.accuracy;
        $scope.$apply();

        var latlng = new google.maps.LatLng($scope.lat, $scope.lng);
        $scope.model.myMap.setCenter(latlng);
        $scope.myMarkers.push(new google.maps.Marker({ map: $scope.model.myMap, position: latlng }));
    }

    $scope.showError = function (error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                $scope.error = "User denied the request for Geolocation."
                break;
            case error.POSITION_UNAVAILABLE:
                $scope.error = "Location information is unavailable."
                break;
            case error.TIMEOUT:
                $scope.error = "The request to get user location timed out."
                break;
            case error.UNKNOWN_ERROR:
                $scope.error = "An unknown error occurred."
                break;
        }
        $scope.$apply();
    }

    $scope.getLocation = function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.showError);
        }
        else {
            $scope.error = "Geolocation is not supported by this browser.";
        }
    }

    $scope.getLocation();
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
    $scope.register = function(){ 
        $http({
            method: 'POST',
            url: $scope.endpoint + 'users/register',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: 'username=' + $scope.username + '&password='+$scope.password + '&place='+$scope.place + '&work='+$scope.work
         }).then(function successCallback(response) {
            $state.go('login', {}, {reload: true});
        }, function errorCallback(response) {

        });
    };
})
.controller('UpdateresumeCtrl', function($scope, $http, localStorageService, $state, $window) {
	$scope.ed =[];
	$scope.ex = [];
	$http({
		method: 'GET',
		url: $scope.endpoint + 'users/profile?token='+$scope.token,
	 }).then(function successCallback(response) {
	  	$scope.work = response.data.work;
	  	$scope.place = response.data.place;
	  	$scope.username = response.data.username;
	  	$scope.id = response.data._id;
		for(var i = 0; i<3; i++){
			if(response.data.education[i] == undefined){
				$scope.ed[i] = {date_start: '', date_end: '', place: '', desciption: ''};
			}else{
				$scope.ed[i] = response.data.education[i];
			}
			if(response.data.experience[i] == undefined){
				$scope.ex[i] = {date_start: '', date_end: '', place: '', desciption: ''};
			}else{
				$scope.ex[i] = response.data.experience[i];
			}
		}
	}, function errorCallback(response) {

	});
	
	$scope.updateresume = function(){
		$http({
			method: 'PUT',
			url: $scope.endpoint + 'users/updateresume?token='+$scope.token,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: 'id='+$scope.id+'&place='+$scope.place + '&work='+$scope.work+'&education='+JSON.stringify($scope.ed) +'&experience='+JSON.stringify($scope.ex)
		 }).then(function successCallback(response) {
		  // $state.go('login', {}, {reload: true});
		}, function errorCallback(response) {

		});

	};    
})
///////////////////
.controller('ProfileCtrl', function($scope, $http, localStorageService, $state, $window) {
	$scope.ed =[];
	$scope.ex = [];
	$http({
		method: 'GET',
		url: $scope.endpoint + 'users/profile?token='+$scope.token,
	 }).then(function successCallback(response) {
	  	$scope.work = response.data.work;
	  	$scope.place = response.data.place;
	  	$scope.username = response.data.username;
	  	$scope.id = response.data._id;
		for(var i = 0; i<3; i++){
			if(response.data.education[i] == undefined){
				$scope.ed[i] = {date_start: '', date_end: '', place: '', desciption: ''};
			}else{
				$scope.ed[i] = response.data.education[i];
			}
			if(response.data.experience[i] == undefined){
				$scope.ex[i] = {date_start: '', date_end: '', place: '', desciption: ''};
			}else{
				$scope.ex[i] = response.data.experience[i];
			}
		}
	}, function errorCallback(response) {

	});   
})
////////////////////

//pause
.controller('addoffersCtrl', function($scope, $http, localStorageService, $state, $window) {
    $scope.addoffers = function(){ 
        $http({
            method: 'POST',
            url: $scope.endpoint + 'barbechoffers/addoffers?token='+$scope.token,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: 'title=' + $scope.title + '&description='+$scope.description + '&company='+$scope.company + '&place='+$scope.place
         }).then(function successCallback(response) {
            $state.go('barbechoffers', {}, {reload: true});
			console.log(response.data);
        }, function errorCallback(response) {

        });
    };
})
 //pause                      
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
.controller('barbechoffersCtrl', function($scope, $http) {
    $http({
        method: 'GET',
        url: $scope.endpoint + 'barbechoffers?token='+$scope.token
    }).then(function successCallback(response) {
        $scope.barbechoffers = response.data;
    }, function errorCallback(response) {

    });
})
.controller('UsersCtrl', function($scope, $http) {
    $http({
        method: 'GET',
        url: $scope.endpoint + 'users?token='+$scope.token
    }).then(function successCallback(response) {
        $scope.users = response.data;
    }, function errorCallback(response) {

    });
})
.controller('advancedsearchCtrl', function($scope, $http) {
	$scope.keywords = 'informatique';
	$scope.offers = [];
    $scope.showPosition = function (position) {
        $scope.lat = position.coords.latitude;
        $scope.lng = position.coords.longitude;
        $scope.accuracy = position.coords.accuracy;
        $scope.$apply();
    }
    $scope.search = function(){
		$http({
			method: 'GET',
			url: $scope.endpoint + 'offers/advancedsearch/'+$scope.keywords+'?token='+$scope.token
		}).then(function successCallback(response) {
			$scope.offers = response.data;
		}, function errorCallback(response) {

		});
	};
	$scope.search();
})

;