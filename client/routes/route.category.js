app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    
	$urlRouterProvider.otherwise('/dashboard');
});