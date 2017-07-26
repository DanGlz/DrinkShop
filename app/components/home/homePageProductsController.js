/**
 * Created by Dan gleyzer on 25-Jun-17.
 */
angular.module("myApp")
    .controller('homePageProductsController', ['$http','UserLogInService','addDeleteCartItemService',
        function ($http,UserLogInService,addDeleteCartItemService) {
        let self = this;
        self.isLoggedIn = UserLogInService.isLoggedIn
        self.newestProducts= [];
        self.reqTopFiveUrl ="http://localhost:3100/Products/GetTopFiveProducts";
        self.addToCart = addDeleteCartItemService.addToCart ;

        $http.get(self.reqTopFiveUrl).then(function (response) {
            self.topFiveProducts=response.data
            if(self.isLoggedIn) {
                self.reqNewestUrl = "http://localhost:3100/Products/LastMonthProducts"
                $http.get(self.reqNewestUrl).then(function (newestResponse) {
                    self.newestProducts = newestResponse.data
                })
            }

        }),function (err) {
            console.log(err.message)
        }

    }]);