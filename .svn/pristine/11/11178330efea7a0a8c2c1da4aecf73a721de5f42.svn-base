app.controller('questionCtrl', ['$scope', '$rootScope', 'Api', '$state', 'toaster', function($scope, $rootScope, Api, $state, toaster) {

    switch($state.current.name){
        case 'question-category':
            $scope.Cate = new $rootScope.Model('question-category');
            $scope.Cate.getList();
            $scope.createQuestionCategory = function(cate){
                Api.post('question-category/create', cate).success(function(response){
                    if(response.error){
                        return toaster.pop('danger', '', response.error);
                    }
                    toaster.pop('success', '', 'Thêm question-category thành công!');
                    $scope.cate = {};
                    $scope.Cate.getList();
                });
            }
            break;
        case 'question':
            $scope.answered = false;
            $scope.record = 10;
            $scope.Quest = new $rootScope.Model('question');
            $scope.Quest.getList();
            Api.get('question-category').success(function(response){
                $scope.categories = response.data;
            });
            break;
    }
    $scope.options = {
        language: 'vi',
        allowedContent: true,
        entities: false,
        extraPlugins : '',
        enterMode : CKEDITOR.ENTER_BR
    };
    $scope.onReady = function() {
        
    };


}])