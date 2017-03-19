app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('setting', {
        url: "/dashboard/setting",
        views: {
            "appView": {
                templateUrl: "/views/cpanel/setting/setting.html"
            }
        }
    })
    .state('setting.home', {
        url: "/home",
        views: {
            "settingView": {
                templateUrl: "/views/cpanel/setting/setting.home.html"
            }
        }
    })
    .state('setting.contact', {
        url: "/contact",
        views: {
            "settingView": {
                templateUrl: "/views/cpanel/setting/setting.contact.html"
            }
        }
    })
	$urlRouterProvider.otherwise('/dashboard');
});