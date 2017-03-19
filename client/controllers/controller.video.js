app.controller('videoCtrl', ['$scope', '$rootScope', 'Api', '$state', 'toaster', function($scope, $rootScope, Api, $state, toaster){
	$scope.Video = new $rootScope.Model("videos");
	$scope.record = 10;
	switch($state.current.name){
		case "videos":
			$scope.Video.getList();
			break;
	}
	$scope.createCateVideo = function(data){
		Api.post('videos/category/create', data).then(function(response){
			if(response.data.error){
				return toaster.pop('warning', '', response.data.error);
			}
			toaster.pop('success', '', 'Thêm danh mục video thành công!');
			$scope.getCateVideo();
			$scope.cate = {};
		});
	}
	$scope.getCateVideo = function(){
		Api.get('videos/category').then(function(response){
			$scope.datas = response.data.data;
		});
	}
	$scope.deleteCateVideos = function(id){
		Api.get('videos/category/delete/' + id).then(function(response){
			$('#data-' + id).fadeOut();
		});
	}
	$scope.createVideo = function(data){
		if(!data.img){
			if(!data.first_frame){
				return toaster.pop('warning', '', 'Hãy chọn ảnh cho video hoặc chọn hình đại diện của video!'); 
			}
		}
		Api.post('videos/create', data).then(function(response){
			if(response.data.error){
				return toaster.pop('warning', '', response.data.error);
			}
			if(data.img){
				Api.upload('videos/upload/' + response.data.data[0]._id, data.img);
			}
			toaster.pop('success', '', 'Thêm video thành công!');
			$scope.data = {};
		});
	}
	$scope.getCateVideo();
}])