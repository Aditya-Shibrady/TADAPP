/**
 * Created by AdityaShibrady on 10/24/15.
 */

(function (angular) {

    var module =  angular.module("playApp");

    module.controller("homeController", [
        '$http',
        function($http){
            console.log("Home Controller entry");


        }]);

})(angular);