/**
 * Created by nitzan on 26/06/17.
 */
angular.module("myApp").factory('getAllProductsService', ['$http', function($http) {
    let self = this;
    console.log( "check");
    self.reqUrl ="http://localhost:3100/Products/GetAllProducts"

    $http.get(self.reqUrl).then(function (response) {
        self.AllProductsProducts=response.data
        console.log(self.products);
    }),function (err) {
        console.log(err.message)
    }
}]);


angular.module("myApp")
    .controller('getAllProducts', ['getAllProductsService', function (getAllProductsService) {
        let self = this;
        console.log( "check");
        self.reqUrl ="http://localhost:3100/Products/GetTopFiveProducts"

        $http.get(self.reqUrl).then(function (response) {
            self.products=response.data
            console.log( self.products);
        }),function (err) {
            console.log(err.message)
        }
    }]);