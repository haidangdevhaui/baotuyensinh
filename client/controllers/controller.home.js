app.controller('homeCtrl', ['$scope', 'Api', '$state', function($scope, Api, $state) {
    // Api.get('statist').then(function(response) {
    //     $scope.statist = response.data.data[0];
    //     new Chartist.Bar('#distributed-series', {
    //         labels: ['Tổng số', 'Khách thăm dự án', 'Khách thăm nhà mẫu', 'Hotline dự án', 'Ghé thăm Website'],
    //         series: [$scope.statist.total, $scope.statist.da, $scope.statist.nm, $scope.statist.hl, $scope.statist.gt]
    //     }, {
    //         distributeSeries: true,
    //         plugins: [
    //             Chartist.plugins.tooltip()
    //         ]
    //     });
    // });

    // Api.get("statist").then(function(response){
    //     $scope.statist = response.data.data[0];
    // });
}])