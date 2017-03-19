app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('contact', {
            url: "/dashboard/contact",
            views: {
                "appView": {
                    templateUrl: "/views/cpanel/contact/contact.html"
                }
            }
        })
	$urlRouterProvider.otherwise('/dashboard');
});