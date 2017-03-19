var app = angular.module('app',[
	'ui.router',
	'ngAnimate',
	'ngCookies',
	'toaster',
	'angular-loading-bar',
	'ckeditor',
	'ui.tree'
	]);

app.config(['cfpLoadingBarProvider','$locationProvider', function(cfpLoadingBarProvider, $locationProvider) {
	cfpLoadingBarProvider.includeSpinner = true;
    $locationProvider.html5Mode(true).hashPrefix('!');
}]);

