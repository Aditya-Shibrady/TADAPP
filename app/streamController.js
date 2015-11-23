/**
 * Created by AdityaShibrady on 11/23/15.
 */
(function(angular){
    var module = angular.module("playApp");
    module.controller("streamController", [
        "$http",
        "$scope",
        function($http, $scope){
            console.log("its really working");

            $scope.scanLive = function(){
                $http.get("http://localhost:3001/twitter").
                success(function (data, status, headers, config) {
                    $scope.resultsy = data;
                    console.log("success", data);

                }).
                error(function (data, status, headers, config) {
                    console.log("error", data);
                });

            };
        }
    ]);
})(angular);