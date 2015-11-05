/**
 * Created by AdityaShibrady on 10/28/15.
 */
(function (angular) {

    var module =  angular.module("playApp");

    module.controller("statsController", [
        "$http",
        "$scope",
        function($http, $scope){
            console.log("stats working");
            $scope.loadSugg = function(){
                $http.get("https://localhost:3001/stats").
                    success(function (data, status, headers, config) {
                        $scope.sabre = data;
                        console.log("success", data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log("error", data);
                    });
            };


        }]);

})(angular);