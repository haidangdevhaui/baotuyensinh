app.controller('contactCtrl', ['$scope', '$rootScope', 'Api', '$state', 'toaster', function($scope, $rootScope, Api, $state, toaster){
	$scope.tinymceOptions = {
        plugins: 'link image code media fullscreen table preview wordcount contextmenu',
        toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code | media'
    };
    $scope.getContact = function(){
    	Api.get('contact').then(function(response){
    		$scope.data = response.data.data[0];
    	});
    }
    $scope.getContact();
    $scope.updateContact = function(data){
    	Api.post('contact/update', data).then(function(response){
    		toaster.pop('success', '', 'Cập nhật liên hệ thành công');
    	});
    }
}]);