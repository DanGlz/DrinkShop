/**
 * Created by nitzan on 26/06/17.
 */

angular.module("myApp")
    .controller('getAllProductsController', ['getAllProductsService','$scope','getRecommendedProductsService','addDeleteCartItemService',
        function (getAllProductsService ,$scope,getRecommendedProductsService ,addDeleteCartItemService) {
        let self = this;
        self.filterBy=""

        getRecommendedProductsService.getRecommendedProducts().then(function (results) {
                self.recommendedProducts = results.data
                getAllProductsService.getAllProducts2().then(function (results) {
                    self.Products = results.data
                    // console.log(self.Products)
                }, function (error) {
                    self.errorMessage = error.data;
                    console.log('get all products didnt succeed');
                })
          // })
        })

        self.addToCart = addDeleteCartItemService.addToCart;

        self.propertyName = 'DrinkID';
        $scope.reverse = true;
        $scope.src = "http://www.hinnawi.org.il/wp-content/uploads/%D7%91%D7%99%D7%A8%D7%94-%D7%92%D7%95%D7%9C%D7%93%D7%A1%D7%98%D7%90%D7%A8-%D7%9C%D7%90-%D7%9E%D7%A1%D7%95%D7%A0%D7%9F-330-%D7%91%D7%A7%D7%91%D7%95%D7%A7-280x280.png"

        $scope.sortBy = function(propertyName) {
            console.log (propertyName)
            if (propertyName == self.propertyName ){
                $scope.reverse =  !$scope.reverse
            }
            self.propertyName = propertyName;
        };
    }]);