app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('users', {
            url: "/dashboard/users",
            views: {
                "appView": {
                    templateUrl: "/views/cpanel/user/user.html"
                }
            }
        })
        .state('profile', {
            url: "/dashboard/profile/:id",
            views: {
                "appView": {
                    templateUrl: "/views/cpanel/user/user.profile.html"
                }
            }
        })
    $urlRouterProvider.otherwise('/dashboard');
});