/**
 * Created by AdityaShibrady on 10/24/15.
 */

(function(angular){
    var module = angular.module("playApp");
    //var SabreDevStudioFlight = require('sabre-dev-studio/lib/sabre-dev-studio-flight');
    //var sabre_dev_studio_flight = new SabreDevStudioFlight({
    //    client_id:     'V1:tdh1rk0cebc1wx6i:DEVCENTER:EXT',
    //    client_secret: 'SkomD9D3',
    //    uri:           'https://api.test.sabre.com'
    //});

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
                    }).
                    error(function (data, status, headers, config) {
                        console.log("error", data);
                    });

            //    $http.get("https://api.test.sabre.com/v1/forecast/flights/fares?origin=JFK&destination=LAX&departuredate=2015-12-12&returndate=2015-12-16").
            //        success(function (data, status, headers, config) {
            //            $scope.resultsy = data;
            //            //$scope.sabre= sab;
            //            console.log("success", data);
            //        }).
            //        error(function (data, status, headers, config) {
            //            console.log("error", data);
            //        });
            //
            };
            $scope.loadSugg = function(){
                $http.get("http://localhost:3001/dest").
                    success(function (data, status, headers, config) {
                        $scope.sabre = data;
                        console.log("success", data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log("error", data);
                    });
            };



        }
    ]);
})(angular);
