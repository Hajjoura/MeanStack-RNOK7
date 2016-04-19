angular.module('twin', ['ui.router', 'twin.controllers', 'LocalStorageModule'])

.run(function($rootScope, localStorageService) {
    $rootScope.token = localStorageService.get('token');
    $rootScope.endpoint = "http://localhost:3001/";
})

.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider

        .state('home', {
            url: '/home',
            templateUrl: 'templates/home.html'
        })

        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl'
        })

        .state('register', {
            url: '/register',
            templateUrl: 'templates/register.html',
            controller: 'RegisterCtrl'
        })

        .state('logout', {
            url: '/logout',
            controller: 'LogoutCtrl'
        })

        .state('offers', {
            url: '/offers',
            templateUrl: 'templates/offers.html',
            controller: 'OffersCtrl'
        })
    
        .state('users', {
            url: '/users',
            templateUrl: 'templates/users.html',
            controller: 'UsersCtrl'
        })
    
        .state('addoffers', {
            url: '/addoffers',
            templateUrl: 'templates/addoffers.html',
            controller: 'addoffersCtrl'
        })
	
	.state('updateresume', {
            url: '/updateresume',
            templateUrl: 'templates/updateresume.html',
            controller: 'UpdateresumeCtrl'
        })
    
    .state('barbechoffers', {
            url: '/barbechoffers',
            templateUrl: 'templates/barbechoffers.html',
            controller: 'barbechoffersCtrl'
        })

          .state('advancedsearch', {
            url: '/advancesdsearch',
            templateUrl: 'templates/advancedsearch.html',
            controller: 'advancedsearchCtrl'
        })
	.state('myprofile', {
            url: '/myprofile',
            templateUrl: 'templates/myprofile.html',
            controller: 'ProfileCtrl'
        })

        .state('about', {
            url: '/about',
            templateUrl: 'templates/about.html'
        })
    ;

});