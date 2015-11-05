/**
 * Created by AdityaShibrady on 10/28/15.
 */
(function (angular) {

    var module =  angular.module("playApp");

    module.controller("destController", [
        "$http",
        "$scope",
        function($http, $scope){
            console.log("Data working");
            $scope.loadSugg = function(){
                $http.get("https://localhost:3001/dest").
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