/**
 * Created by nitzan on 26/06/17.
 */
angular.module("myApp").factory('getAllProductsService', ['$http', function($http) {

    let service = {};
    service.allProducts = [];
    service.getAllProducts = function() {
        if (service.allProducts.length === 0) {
            return $http.get("/Products/GetAllProducts")
                .then(function (response) {
                    service.allProducts = response.data
                    return Promise.resolve(service.allProducts)
                }).catch(function () {
                    return Promise.reject();
                });
        }
        else
            return Promise.resolve(service.allProducts);
    }
    return service;
}]);

