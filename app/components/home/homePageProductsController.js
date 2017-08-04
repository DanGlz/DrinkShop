/**
 * Created by Dan gleyzer on 25-Jun-17.
 */
angular.module("myApp")
    .controller('homePageProductsController', ['$scope','$http','UserLogInService','CartService','homePageProductsService','productDetailsService','ngDialog',
        function ($scope,$http,UserLogInService,CartService,homePageProductsService,productDetailsService,ngDialog){
        let self = this;
        self.isLoggedIn = UserLogInService.isLoggedIn
        self.newestProducts= homePageProductsService.newestProducts;
        self.topFiveProducts=homePageProductsService.topFiveProducts;
        self.reqTopFiveUrl ="http://localhost:3100/Products/GetTopFiveProducts";
        self.addToCart = CartService.addToCart ;

        if(self.newestProducts.length === 0 || self.topFiveProducts.length === 0 ) {
            $http.get(self.reqTopFiveUrl).then(function (response) {
                self.topFiveProducts = response.data
                homePageProductsService.topFiveProducts = response.data
                if (self.isLoggedIn) {
                    self.reqNewestUrl = "http://localhost:3100/Products/LastMonthProducts"
                    $http.get(self.reqNewestUrl).then(function (newestResponse) {
                        self.newestProducts = newestResponse.data
                        homePageProductsService.newestProducts = newestResponse.data;
                    })
                }


            }), function (err) {
                console.log(err.message)
            }
        }

            self.propertyName = 'DrinkID';
            $scope.reverse = true;


            $scope.sortBy = function(propertyName) {
                console.log (propertyName)
                if (propertyName == self.propertyName ){
                    $scope.reverse =  !$scope.reverse
                }
                self.propertyName = propertyName;
            };
            self.ReadMore = function (product) {
                console.log("dsfs")
                productDetailsService.setProduct(product)
                ngDialog.open({
                    template: "components/productDetails/productDetails.html",
                    controller: 'productDetailsController'
                });
            }

    }]);