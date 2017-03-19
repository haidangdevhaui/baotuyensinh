app.controller('mediaCtrl', ['$scope', '$rootScope', 'Api', '$state', 'toaster', '$compile', function($scope, $rootScope, Api, $state, toaster, $compile){
	$scope.record = 10;
	
	$scope.Media = new $rootScope.Model('media');
	

	$scope.createCateMedia = function(data){
		Api.post('media/category/create', data).then(function(response){
			if(response.data.error){
				return toaster.pop('warning', '', response.data.error);
			}
			toaster.pop('success', '', 'Thêm danh mục media thành công!');
			$scope.getCateMedia();
			$scope.cate = {};
		});
	}
	$scope.getCateMedia = function(media){
		if(media){
			uri = 'media/category?media=' + media;
		}else{
			uri = 'media/category';
		}
		Api.get(uri).then(function(response){
			$scope.datas = response.data.data;
		});
	}
	switch($state.current.name){
		case 'media':
			$scope.getCateMedia();
			$scope.Media.getList();
			break;
		case 'media-category':
			$scope.getCateMedia();
			break;
		case 'media-create': 
			$scope.action = 'create';
			$scope.data = {};
			break;
		case 'media-update':
			$scope.action = 'update';
			Api.get('media?id=' + $state.params.id).success(function(response){
				$scope.data = response.data[0];
				switch($scope.data.media){
					case 'video':
						$scope.data.src = $scope.data.video.src
						break;
					case 'image':
						$scope.data.images;
						break;
				}
				$scope.data.type = $scope.data.type._id;
				$scope.getCateMedia($scope.data.media);
			});
			break;
	}
	$scope.deleteCateMedia = function(id){
		Api.get('media/category/delete/' + id).then(function(response){
			$('#data-' + id).fadeOut();
		});
	}
	$scope.img = [];
	var i = 0;
	$scope.addFileImg = function(){
		i++;
		$('#fileImgDiv').append($compile('<input type="file" file-model="img[' + i + ']">')($scope));
	}
	$scope.uploadImg = function(img){
		Api.upload('upload', img).success(function(response){
			$scope.img = [];
			$('#fileImgDiv>input[type="file"]').fadeOut();
			if(!$scope.data.images){
				$scope.data.images = response.data;
			}else{
				for (var i = 0; i < response.data.length; i++) {
					$scope.data.images.push(response.data[i]);
				};
			}
		});
	}
	$scope.removeImg = function(index){
		Api.post('remove-img', {path: $scope.data.images[index]}).success(function(response){
			$scope.data.images.splice(index, 1);
		});
	}
	$scope.addImgUrl = function(url){
		if(url){
			if(!$scope.data.images){
				$scope.data.images = [url];
			}else{
				$scope.data.images.push(url);
			}
			delete $scope.data.imgUrl;
		}
		return;
	}
	$scope.createMedia = function(data){
		data.action = $scope.action;
		if(!data.type) return toaster.pop('warning', '', 'Hãy chọn danh mục media!');
		if(!data.img){
			if(data.media == 'video'){
				if(!data.first_frame){
					return toaster.pop('warning', '', 'Hãy chọn ảnh cho video hoặc chọn hình đại diện của video!'); 
				}
			}
			if(data.media == 'image'){
				if(!data.mediaImg){
					return toaster.pop('warning', '', 'Hãy chọn ảnh cho album hoặc chọn hình đại diện của album!'); 
				}
			}
			
		}
		var imgObj = data.img;
		delete data.img;
		if($scope.action == 'update'){
			delete data.name;
		}
		Api.post('media/create', data).then(function(response){
			if(response.data.error){
				return toaster.pop('warning', '', response.data.error);
			}
			if(imgObj && typeof imgObj != 'string'){
				Api.upload('media/upload/' + response.data.data[0]._id, imgObj);
			}
			if($scope.action == 'update'){
				toaster.pop('success', '', 'Cập nhật video thành công!');
				return $state.go('media');
			}
			toaster.pop('success', '', 'Thêm video thành công!');
			$scope.data = {};
		});
	}
	$scope.selectMedia = function(media){
		$scope.getCateMedia(media);
	}
	$scope.options = {
        language: 'en',
        allowedContent: true,
        entities: false,
        extraPlugins : 'syntaxhighlight'
    };
    $scope.onReady = function() {
        
    };
    
}])