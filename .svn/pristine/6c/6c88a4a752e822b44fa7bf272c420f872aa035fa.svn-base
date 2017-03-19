app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('question', {
            url: "/dashboard/question",
            views: {
                "appView": {
                    templateUrl: "/views/cpanel/question/question.html"
                }
            }
        })
    .state('question-category', {
            url: "/dashboard/question-category",
            views: {
                "appView": {
                    templateUrl: "/views/cpanel/question/category.html"
                }
            }
        })
	$urlRouterProvider.otherwise('/dashboard');
});