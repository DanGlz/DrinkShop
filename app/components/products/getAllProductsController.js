/**
 * Created by nitzan on 26/06/17.
 */

angular.module("myApp")
    .controller('getAllProductsController', ['getAllProductsService','$scope','getRecommendedProductsService','localStorageService','$window',
        function (getAllProductsService ,$scope,getRecommendedProductsService ,localStorageService ,$window) {
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

        self.addToCart = function (product ){
            let valueStored = localStorageService.get("cart "+product.DrinkID);
            //console.log (product.amount)
            if (!valueStored) {
                if (localStorageService.set("cart "+product.DrinkID, product.amount))
                    $window.alert("the drink " +product.DrinkName + " added successfully to the your cart");
                else
                    console.log('failed to add data to cart');
            }
            else {
                var tmp = parseInt(localStorageService.get("cart "+product.DrinkID)) ;
                tmp = tmp +parseInt(product.amount)
                localStorageService.remove("cart "+product.DrinkID);
                localStorageService.set("cart "+product.DrinkID, tmp)
                $window.alert("we added " + product.amount + " more of " + product.DrinkName + "to your cart ");
            }
       }

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