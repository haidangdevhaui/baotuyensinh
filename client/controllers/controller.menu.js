app.controller('menuCtrl', ['$scope', '$rootScope', 'Api', '$state', 'toaster', function($scope, $rootScope, Api, $state, toaster){
	// $scope.Menu = new $rootScope.Model("menu");
	$scope.treeOptions = {
		accept: function(sourceNodeScope, destNodesScope, destIndex) {
			return true;
		},
	};
	Api.get('types').then(function(response){
		$scope.types = response.data.data;
	});
	$scope.getMenu = function(){
		Api.get('menu').success(function(response){
			$scope.menus = response.data;
		});
	}
	$scope.getMenu();
	$scope.addMenu = function(c){
		var menuItem = {
			url: c.url,
			name: c.name,
			tid: c._id
		}
		Api.post('menu/create', menuItem).then(function(response){
			$scope.getMenu();
		});
	}
	
	
	$scope.isMenu = function(item, arr){
		var is = false;
		if(!arr || arr.length == 0){
			return is;
		}
		for (var i = 0; i < arr.length; i++) {
			if(item == arr[i].url){
				is = true;
			}
		};
		return is;
	}
	$scope.sortMenu = function(){
		Api.post('menu/sort', $scope.menus).then(function(response){
			$scope.getMenu();
			toaster.pop('success', '', 'Thay đổi menu thành công!');
		});
	};


}])