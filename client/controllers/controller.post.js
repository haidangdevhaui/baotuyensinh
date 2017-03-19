app.controller('newsCtrl', ['$rootScope', '$scope', 'Api', '$state', 'toaster', '$sce', function($rootScope, $scope, Api, $state, toaster, $sce) {
    $scope.delete = function(id) {
        Api.get('news/delete/' + id).then(function(response) {
            $('#data-' + id).fadeOut();
            toaster.pop('success', '', 'Xóa tin thành công!');
        });
    }
    $scope.record = 10;
    $scope.typeFilter = "";
    $scope.News = new $rootScope.Model("news");
    $scope.getDataType = function(){
        Api.get('types').then(function(response){
            $scope.dataTypes = response.data.data;
        });
    }
    switch ($state.current.name) {
        case 'news':
            $scope.News.getList();
            $scope.getDataType();
            break;
        case 'news-create':
            $scope.action = 'create';
            var text = 'Đăng';
            $scope.data = {};
            $scope.getDataType();

            break;
        case 'news-update':
            $scope.action = 'update';
            var text = 'Cập nhật';
            $scope.getDataType();
            Api.get('news?id=' + $state.params.id).then(function(response) {
                $scope.data = response.data.data[0];
                $scope.selectType($scope.data.type._id);
                $scope.data.type = $scope.data.type._id;
                $scope.data.category = $scope.data.category._id;
            });
            break;
        case 'news-detail':
            Api.get('news?id=' + $state.params.id).then(function(response) {
                $scope.data = response.data.data[0];
            });
            Api.get('comments?id=' + $state.params.id).then(function(response) {
                $scope.comments = response.data.data;
            });
            break;
    }
    $scope.createNews = function(data) {
        if(!data.img){
            if(!data.imgSrc) return toaster.pop('warning', '', 'Hãy chọn ảnh cho tin!');
        }
        var img = data.img;
        delete data.img;
        if($scope.action == 'update'){
            delete data.name;
        }
        data.action = $scope.action;
        /**/
        // data.file = img;
        // return Api.posts('news/create', data).success(function(response){
            
        // });

        /**/
        Api.post('news/create', data).then(function(response) {
            if(response.data.error){
                return toaster.pop('success', '', response.data.error);
            }
            if(img && typeof img != 'string'){
                Api.upload('news/upload/' + response.data.data[0]._id, img).then(function(res) {
                    if (res) {
                        $scope.data = {};
                        if($scope.action == 'update'){
                            $state.go('news');
                        }
                        return toaster.pop('success', '', text + ' tin thành công!');
                    }
                });
            }
            $scope.data = {};
            if($scope.action == 'update'){
                $state.go('news');
            }
            toaster.pop('success', '', text + ' tin thành công!');
        });
    }
    $scope.detail = {};
    $scope.createDetail = function(detail) {
        var img_detail = detail.img;
        detail.img = null;
        Api.post('news/detail/' + $state.params.id, detail).then(function(response) {
            if (response.data.data[0]) {
                if (img_detail) {
                    Api.upload('news/detail/upload/' + $state.params.id, img_detail).then(function(res) {
                        if (res) {
                            $scope.detail = {};
                            toaster.pop('success', '', 'Thêm nội dung tin thành công!');
                            Api.get('news?id=' + $state.params.id).then(function(response) {
                                $scope.data = response.data.data[0];
                            });
                        }
                    });
                } else {
                    $scope.detail = {};
                    toaster.pop('success', '', 'Thêm nội dung tin thành công!');
                    Api.get('news?id=' + $state.params.id).then(function(response) {
                        $scope.data = response.data.data[0];
                    });
                }
            }
        });
    }
    $scope.delDetail = function() {
        Api.get('news/delete-detail/' + $state.params.id).then(function(response) {
            if (response) {
                toaster.pop('success', '', 'Xóa nội dung tin thành công!');
                Api.get('news?id=' + $state.params.id).then(function(response) {
                    $scope.data = response.data.data[0];
                });
            };
        });
    }
    $scope.renderHtml = function(value) {
        return $sce.trustAsHtml(value);
    };
    $scope.delComment = function(id) {
        Api.get('comments/delete/' + id).then(function(response) {
            toaster.pop('success', '', 'Xóa comment thành công!')
            $('#comment-' + id).fadeOut();
        });
    }
    $scope.acceptComment = function(id) {
        Api.get('comments/accept/' + id).then(function(response) {
            toaster.pop('success', '', 'Duyệt comment thành công!')
        });
    }
    $scope.delAnswer = function(id) {
        Api.get('answers/delete/' + id).then(function(response) {
            toaster.pop('success', '', 'Xóa trả lời thành công!')
            $('#answer-' + id).fadeOut();
        });
    }
    $scope.acceptAnswer = function(id) {
        Api.get('answers/accept/' + id).then(function(response) {});
    }
    $scope.addIdComment = function(id) {
        return $scope.commentId = id;
    }
    $scope.answerComment = function(content) {
        if (content == undefined || content == "") {
            $('.notice-answer').html('Vui lòng nhập nội dung trả lời!');
        } else {
            $('.notice-answer').html('');
            Api.post('comments/answer', {content: content, cid: $scope.commentId}).then(function(response) {
                $scope.cmt = '';
                $('#answer').on('hidden.bs.modal', function () {});
                toaster.pop('success', '', 'Trả lời comment thành công!');
                Api.get('comments?id=' + $state.params.id).then(function(response) {
                    $scope.comments = response.data.data;
                });
            });
        }
    }
    $scope.selectType = function(id){
        Api.get('category?tid=' + id).then(function(response){
            $scope.dataCates = response.data.data;
        });
    }
    $scope.changeHot = function(id){
        Api.get('news/change-hot/' + id).success(function(response){});
    }
    
    $scope.newsFilter = new $rootScope.myFilter();
    $scope.options = {
        language: 'en',
        allowedContent: true,
        entities: false,
        extraPlugins : 'syntaxhighlight'
    };
    $scope.onReady = function() {
        
    };
}])