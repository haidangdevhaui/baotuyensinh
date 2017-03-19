app.service('Api', ['$http', function($http) {
    var obj = {};
    obj.get = function(route) {
        return $http.get('/api/v1/' + route);
    }
    obj.post = function(route, data) {
        return $http.post('/api/v1/' + route, data);
    }
    obj.upload = function(route, file) {
        var fd = new FormData();
        if(file.length){
            for (var i = 0; i < file.length; i++) {
                fd.append('file['+ i +']', file[i]);
            };
        }else{
            fd.append('file', file);
        }
        return $http.post('/api/v1/' + route, fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        });
    }

    obj.posts = function (route, data){
        var fd = new FormData();
        if(data.file){
            var file = data.file;
            if(file.length){
                for (var i = 0; i < file.length; i++) {
                    fd.append('file['+ i +']', file[i]);
                };
            }else{
                fd.append('file', file);
            }
        }
        delete data.file;
        fd.append('data', angular.toJson(data));
        return $http.post('/api/v1/' + route, fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        });
    }
    return obj;
}])