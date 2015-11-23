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
                    .when("/search", {
                        templateUrl: "search",
                        controller:"searchController"
                    })
                    .when("/dest", {
                        templateUrl: "Destination",
                        controller:"destController"
                    })
                    .when("/stream", {
                        templateUrl: "stream",
                        controller:"streamController"
                    })
                    .otherwise("/");
            }
        ]
    );

})(angular);