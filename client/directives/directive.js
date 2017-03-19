app.directive('htmlParse', function($compile, $parse) {
    return {
        restrict: 'E',
        link: function(scope, element, attr) {
            scope.$watch(attr.content, function() {
                element.html($parse(attr.content)(scope));
                $compile(element.contents())(scope);
            }, true);
        }
    }
});
app.directive('active',['$state', function($state) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            if (attr.active == $state.current.name.toString().replace('.', '-')) {
                element.addClass('active');
            }
            element.on('click', function() {
            	$('.' + attr.class).removeClass('active');
		      	element.addClass('active');
		    });
        }
    }
}]);

app.directive('fileModel',['$parse',function($parse){
    return {
        restrict : 'A',
        link : function(scope, element, attrs){

            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change',function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                })
            })
        }
    }
}]);
