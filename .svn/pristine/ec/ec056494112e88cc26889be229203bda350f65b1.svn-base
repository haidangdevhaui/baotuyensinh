app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('ad', {
            url: "/dashboard/ad",
            views: {
                "appView": {
                    templateUrl: "/views/cpanel/ad/ad.html"
                }
            }
        })

        .state('ad-update', {
            url: "/dashboard/ad-media/:id",
            views: {
                "appView": {
                    templateUrl: "/views/cpanel/ad/ad.create.html"
                }
            }
        })

        .state('ad-create', {
            url: "/dashboard/ad-create",
            views: {
                "appView": {
                    templateUrl: "/views/cpanel/ad/ad.create.html"
                }
            }
        })
    $urlRouterProvider.otherwise('/dashboard');
});