/**
 * Created by Dan gleyzer on 25-Jun-17.
 */
angular.module("myApp")
    .controller('top5productsController', ['$http', function ($http) {
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