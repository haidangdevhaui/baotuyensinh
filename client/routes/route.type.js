app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('types', {
            url: "/dashboard/types",
            views: {
                "appView": {
                    templateUrl: "/views/cpanel/type/types.html"
                }
            }
        })
	$urlRouterProvider.otherwise('/dashboard');
});