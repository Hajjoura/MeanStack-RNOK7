angular.module('twin.controllers', [])

.controller('MenuCtrl', function($scope, localStorageService) {

})

.controller('HomeCtrl', function($scope, uiGmapGoogleMapApi, $http){
	$scope.map = { center: { latitude: 36.8986883, longitude: 10.1875003 }, zoom: 14 };
	$scope.marker_id = 'test';
	uiGmapGoogleMapApi.then(function(maps) {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				
			  var pos = {
				latitude: position.coords.latitude,
				longitude: position.coords.longitude
			  };
				
				var geocoder = new google.maps.Geocoder();
				var latlng = new google.maps.LatLng(pos.latitude, pos.longitude);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
		  var keywords = results[0].address_components[1].short_name;
		  $http({
			method: 'GET',
			url: $scope.endpoint + 'offers/advancedsearch/'+keywords+'?token='+$scope.token
		}).then(function successCallback(response) {
			$scope.offers = response.data;
		}, function errorCallback(response) {

		});
	  }
	})
				
			  $scope.map.center = pos;
				$scope.$apply();
			}, function() {
			  alert('error');
			});
		  } else {
			// Browser doesn't support Geolocation
			alert('error');
		  }
    });
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
            data: 'username=' + $scope.username + '&password='+$scope.password + '&place='+$scope.place +'&mail='+$scope.mail + '&work='+$scope.work
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////


.controller('SuitableOffersCtrl', function($scope, $http, localStorageService, $state, $window) {
	$http({
		method: 'GET',
		url: $scope.endpoint + 'users/profile?token='+$scope.token,
	 }).then(function successCallback(response) {
	  	$http({
			method: 'GET',
			url: $scope.endpoint + 'offers/advancedsearch/'+response.data.work+'?token='+$scope.token
		}).then(function successCallback(response) {
			$scope.offers = response.data;
		}, function errorCallback(response) {

		});
	}, function errorCallback(response) {

	});
	
	
})

///////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////


.controller('OffersByplaceCtrl', function($scope, $http, localStorageService, $state, $window) {
	$http({
		method: 'GET',
		url: $scope.endpoint + 'users/profile?token='+$scope.token,
	 }).then(function successCallback(response) {
	  	$http({
			method: 'GET',
			url: $scope.endpoint + 'offers/advancedsearch/'+response.data.place+'?token='+$scope.token
		}).then(function successCallback(response) {
			$scope.offers = response.data;
		}, function errorCallback(response) {

		});
	}, function errorCallback(response) {

	});
	
	
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
        $state.go('login', {}, {reload: false});
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