/**
 * Created by Dan gleyzer on 27-Jun-17.
 */
angular.module("myApp").factory('getRecommendedProductsService', ['$http', function($http) {

    let service = {};
    service.getRecommendedProducts = function() {
        return  $http.get("/Products/GetRecommendedProducts")
            .then(function (response) {
                return Promise.resolve(response)
            }).catch(function (err) {
                return Promise.reject(e);
            });
    };
    return service;
}]);

