/**
 * Created by AdityaShibrady on 11/23/15.
 */
(function(angular){
    var module = angular.module("playApp");
    module.controller("custController", [
        "$http",
        "$scope",
        function($http, $scope){
            console.log("its apparently working");

            $scope.scanCust = function(){
                $http.get("http://localhost:3001/prof").
                success(function (data, status, headers, config) {
                    $scope.resultsc = data;
                    console.log("success", data);

                }).
                error(function (data, status, headers, config) {
                    console.log("error", data);
                });

            };
        }
    ]);
})(angular);