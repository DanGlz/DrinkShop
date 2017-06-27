/**
 * Created by nitzan on 26/06/17.
 */
angular.module("myApp").factory('getAllProductsService', ['$http', function($http) {

    let service = {};
    service.getAllProducts2 = function() {
        return  $http.get("/Products/GetAllProducts")
            .then(function (response) {
            return Promise.resolve(response)
        }).catch(function (err) {
            return Promise.reject(e);
        });
    };
    return service;
}]);

