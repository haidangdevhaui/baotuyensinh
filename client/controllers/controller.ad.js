app.controller('adCtrl', ['$scope', '$rootScope', 'Api', '$state', 'toaster', function($scope, $rootScope, Api, $state, toaster){
	$scope.Ad = new $rootScope.Model('ads');
	$scope.createAd = function(data){
		data.action = $scope.action;
		if(data.status){ data.status = true;};
		if(data.open){ data.open = true;};
		Api.posts('ads/create', data).success(function(response){
			$scope.data = {};
			toaster.pop('success', '', 'Tạo quảng cáo thành công!');
		});
	}
	$scope.getPositionAd = function(){
		Api.get('ads/position').success(function(response){
			$scope.positions = response.data;
		});
	}
	$scope.getPositionAd();
	switch($state.current.name){
		case 'ad-create': 
			$scope.data = {
				position: ''
			};
			$scope.getPositionAd();
			$scope.action = 'create';
			break;
		case 'ad':
			$scope.Ad.getList();
			$scope.record = 10;
			break;
		case 'ad-update':
			Api.get('ads?aid=' + $state.params.id).success(function(response){
				$scope.data = response.data[0];
			});
			$scope.action = 'update';
			break;
	}
}]);