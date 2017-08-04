/**
 * Created by Dan gleyzer on 27-Jun-17.
 */
angular.module("myApp").factory('getRecommendedProductsService', ['$http', function($http) {

    let service = {};
    service.recommendedProducts=[];
    service.getRecommendedProducts = function() {
        if (service.recommendedProducts.length === 0) {
            return $http.get("/Products/GetRecommendedProducts")
                .then(function (response) {
                    service.recommendedProducts=response.data
                    return Promise.resolve(service.recommendedProducts)
                }).catch(function () {
                    return Promise.reject();
                });
        }
        else
            return Promise.resolve(service.recommendedProducts)
    };
    return service;
}]);

