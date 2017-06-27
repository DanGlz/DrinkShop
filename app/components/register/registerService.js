/**
 * Created by nitzan on 27/06/17.
 */
angular.module("myApp").factory('registerService', ['$http', function($http) {

    let service = {};
    service.register = function(userDetails) {
        return  $http.post("/Register" , userDetails)
            .then(function (response) {
                return Promise.resolve(response)
            }).catch(function (err) {
                return Promise.reject(e);
            });
    };
    return service;
}]);
