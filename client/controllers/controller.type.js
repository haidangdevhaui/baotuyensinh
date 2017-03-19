app.controller('typesCtrl', ['$scope', '$rootScope', 'Api', '$state', 'toaster', '$sce', function($scope, $rootScope, Api, $state, toaster, $sce) {
	$scope.cate = {};
	$scope.cate.tid;
	$scope.createType = function(type){
		Api.post('types/create', type).then(function(response){
			toaster.pop('success', '', 'Tạo loại tin thành công!');
			$rootScope.getTypes();
			$scope.type = {};
		});
	};
	$scope.createCate = function(cate){
		Api.post('category/create', cate).then(function(response){
			toaster.pop('success', '', 'Tạo danh mục tin thành công!');
			$rootScope.getTypes();
			$scope.cate = {};
		});
	};
	$rootScope.getTypes = function(){
		Api.get('types').then(function(response){
			$scope.datas = response.data.data;
		});
	}
	$rootScope.getCates = function(){
		Api.get('category').then(function(response){
			$scope.cates = response.data.data;
		});
	}
	$scope.deleteType = function(id){
		Api.get('types/delete/' + id).then(function(response){
			toaster.pop('success', '', 'Xóa loại tin thành công!');
			$('#type-' + id).fadeOut();
			$rootScope.getTypes();
		});
	}
	$scope.deleteCate = function(id){
		Api.get('category/delete/' + id).then(function(response){
			toaster.pop('success', '', 'Xóa danh mục tin thành công!');
			$('#cate-' + id).fadeOut();
		});
	}
	$rootScope.getTypes();
}]);