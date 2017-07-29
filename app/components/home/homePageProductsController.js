/**
 * Created by Dan gleyzer on 25-Jun-17.
 */
angular.module("myApp")
    .controller('homePageProductsController', ['$scope','$http','UserLogInService','CartService',
        function ($scope,$http,UserLogInService,CartService) {
        let self = this;
        self.isLoggedIn = UserLogInService.isLoggedIn
        self.newestProducts= [];
        self.reqTopFiveUrl ="http://localhost:3100/Products/GetTopFiveProducts";
        self.addToCart = CartService.addToCart ;

        $http.get(self.reqTopFiveUrl).then(function (response) {
            self.topFiveProducts=response.data
            if(self.isLoggedIn) {
                self.reqNewestUrl = "http://localhost:3100/Products/LastMonthProducts"
                $http.get(self.reqNewestUrl).then(function (newestResponse) {
                    self.newestProducts = newestResponse.data
                })
            }

            self.propertyName = 'DrinkID';
            $scope.reverse = true;
            $scope.src = "https://www.foodis.co.il/images/features/pics4/Goldstar.jpg"

            $scope.sortBy = function(propertyName) {
                console.log (propertyName)
                if (propertyName == self.propertyName ){
                    $scope.reverse =  !$scope.reverse
                }
                self.propertyName = propertyName;
            };

        }),function (err) {
            console.log(err.message)
        }



    }]);