/**
 * Created by Subbu on 7/22/15.
 */

(function (angular) {
    var myApp = angular.module("playApp", [
        "ngRoute"
    ]);

    myApp.config(
        [
            "$routeProvider",
            function ($routeProvider) {
                $routeProvider
                    .when("/home", {
                        templateUrl: "home",
                        controller:"homeController"
                    })
                    .when("/search", {
                        templateUrl: "search",
                        controller:"searchController"
                    })
                    .when("/dest", {
                        templateUrl: "Destination",
                        controller:"destController"
                    })
                    .otherwise("/");
            }
        ]
    );

})(angular);