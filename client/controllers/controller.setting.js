app.controller('settingCtrl', ['$scope', '$rootScope', 'Api', '$state', 'toaster', function($scope, $rootScope, Api, $state, toaster){
	Api.get('setting').success(function(response){
        $scope.set = JSON.parse(response.data);
    });
    $scope.setting = function(set){
        Api.post('setting', set).success(function(response){
            if(response.error) return toaster.pop('error', '', response.error);
            return toaster.pop('success', '', 'Thiết lập thành công!');
        });
    }
}]);