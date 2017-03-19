app.controller('userCtrl', ['$scope', '$rootScope', 'Api', '$state', 'toaster', function($scope, $rootScope, Api, $state, toaster) {
    $scope.Users = new $rootScope.Model('users');
    $scope.record = 10;
    $scope.typeFilter = "";
    if ($state.params.id) {
        $scope.Users.getItem($state.params.id);
        $scope.auth = function(a){
	    	Api.post('users/auth/' + $state.params.id, {auth: a}).then(function(response){
	    		if(response.data.error){
	    			toaster.pop('warning', '', 'Bạn không đủ quyền hạn để thực hiện chức năng này!');
	    		}else{
	    			toaster.pop('success', '', 'Thay đổi quyền thành công!');
	    		}
	    	});
	    }
	    $scope.dataManager = [];
	    Api.get('types').then(function(response){
	    	$scope.types = response.data.data;
	    });
        initUi();
    } else {
        $scope.Users.getList();
    }

    function initUi(){
    	$('.datepicker').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: "yy-mm-dd"
        });
    }
}])