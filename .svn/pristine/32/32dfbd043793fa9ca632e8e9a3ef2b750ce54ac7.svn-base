app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('news', {
            url: "/dashboard/news",
            views: {
                "appView": {
                    templateUrl: "/views/cpanel/post/post.html"
                }
            }
        }).state('news-create', {
            url: "/dashboard/news/create",
            views: {
                "appView": {
                    templateUrl: "/views/cpanel/post/post.create.html"
                }
            }
        }).state('news-update', {
            url: "/dashboard/news/update/:id",
            views: {
                "appView": {
                    templateUrl: "/views/cpanel/post/post.create.html"
                }
            }
        }).state('news-detail', {
            url: "/dashboard/news/detail/:id",
            views: {
                "appView": {
                    templateUrl: "/views/cpanel/post/post.detail.html"
                }
            }
        })
	$urlRouterProvider.otherwise('/dashboard');
});