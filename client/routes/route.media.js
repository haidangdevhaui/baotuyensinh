app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('media', {
            url: "/dashboard/media",
            views: {
                "appView": {
                    templateUrl: "/views/cpanel/media/media.html"
                }
            }
        })
        .state('media-category', {
            url: "/dashboard/category-media",
            views: {
                "appView": {
                    templateUrl: "/views/cpanel/media/media.category.html"
                }
            }
        })
        .state('media-create', {
            url: "/dashboard/create-media",
            views: {
                "appView": {
                    templateUrl: "/views/cpanel/media/media.create.html"
                }
            }
        })

        .state('media-update', {
            url: "/dashboard/edit-media/:id",
            views: {
                "appView": {
                    templateUrl: "/views/cpanel/media/media.create.html"
                }
            }
        })
	$urlRouterProvider.otherwise('/dashboard');
});