/**
 * Created by AdityaShibrady on 10/24/15.
 */
(function(angular){
    var module = angular.module("playApp");
    module.controller("searchController", [
        "$http",
        "$scope",
        function($http, $scope){
            console.log("its working");
            $scope.emailID = "";
            $scope.scanUser = function(){
                console.log("Entered email id is ", $scope.emailID);
                $http.get("https://api.fullcontact.com/v2/person.json?apiKey=2c3b2ee771510bee&email="+$scope.emailID).
                    success(function (data, status, headers, config) {
                        $scope.results = data;
                        //$scope.sabre= sab;
                        console.log("success", data);
                    console.log("status", status);
                    if (status != 200) {
                        $scope.pink = "Customer Not Found! Sending Email To Customer for Profile Updation!"
                    }
                    }).
                    error(function (data, status, headers, config) {
                        console.log("error", data);
                    if (status != 200) {
                        $scope.pink = "Customer Not Found! Sending Email To Customer for Profile Updation!"
                    }
                    });
            };
        }
    ]);
})(angular);