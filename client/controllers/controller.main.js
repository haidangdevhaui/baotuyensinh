app.controller('mainCtrl', ['$scope', '$rootScope', 'Api', '$window', 'toaster', function($scope, $rootScope, Api, $window, toaster) {
    Api.get('user').then(function(response) {
        $rootScope.user = response.data;
    });
    $rootScope.logout = function() {
        return $window.location.href = '/logout';
    }
    $rootScope.getHome = function() {
        return $window.location.href = '/';
    }
    $rootScope.myFilter = function(model) {
        this.run = function(record, page, current) {
            Api.get(model + '?page=' + page + '&record=' + record).then(function(response) {
                $rootScope.data = response.data.data[0];
            });
        }
    }
    $rootScope.Model = function(model) {
        this.getList = function() {
            if (arguments.length == 0) {
                var path = "";
            }
            if (typeof arguments[0] == "string") {
                if (arguments.length == 1) {
                    var path = "?type=" + arguments[0];
                }
                if (arguments.length == 2) {
                    var path = "?type=" + arguments[0] + "&page=" + arguments[1];
                }
                if (arguments.length == 3) {
                    var path = "?type=" + arguments[0] + "&page=" + arguments[1] + "&record=" + arguments[2];
                }
                if(arguments.length == 4){
                    var path = "?type=" + arguments[0] + "&page=" + arguments[1] + "&record=" + arguments[2] + "&hot=" + arguments[3];
                }
            } else {
                if (arguments.length == 1) {
                    var path = "?page=" + arguments[0];
                }
                if (arguments.length == 2) {
                    var path = "?page=" + arguments[0] + "&record=" + arguments[1];
                }
            }
            Api.get(model + path).then(function(response) {
                $scope.data = response.data.data;
                $scope.currentPage = response.data.current;
                $scope.totalPage = [];
                for (var i = 0; i < response.data.total; i++) {
                    $scope.totalPage.push(i + 1);
                };
            });
        };
        var getList = this.getList;
        var org = this;
        this.getItem = function(id) {
            var path = "?id=" + id;
            Api.get(model + path).then(function(response) {
                $scope.data = response.data.data[0];
                if (model == "users") {
                    $scope.account = {
                        username: $scope.data.username,
                        email: $scope.data.email
                    }
                    $scope.manager = $scope.data.manager;
                }
            });
        }
        this.isset = function(ele, arr){
        	var result = false;
        	for (var i = 0; i < arr.length; i++) {
        		if(arr[i] == ele){
        			result = true;
        		}
        		if(i == arr.length - 1){
        			return result;
        		}
        	};
        }
        this.update = function(data) {
            Api.post(model + '/update/' + data._id, data).then(function(response) {
                toaster.pop('success', '', 'Cập nhật '+ model +' thành công!');
            });
        }
        this.sort = function(type) {
            $scope.sortKey = type;
            $scope.reverse = !$scope.reverse;
        }
        this.delete = function(id) {
            Api.get(model + '/delete/' + id).success(function(response) {
                toaster.pop('success', '', 'Xóa '+ model +' thành công!');
                $('#data-' + id).fadeOut();
            });
        }
        this.status = function(id) {
            Api.get(model + '/status/' + id).then(function(response) {
                toaster.pop('success', '', 'Thay đổi trạng thái thành công!');
            });
        }
    }
}])