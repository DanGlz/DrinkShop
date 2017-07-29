/**
 * Created by nitzan on 26/06/17.
 */

angular.module("myApp")
    .controller('getAllProductsController', ['getAllProductsService','$scope','getRecommendedProductsService','CartService',
        function (getAllProductsService ,$scope,getRecommendedProductsService ,CartService) {
        let self = this;
        self.filterBy=""
        self.categories= [
            {label :"All", category:""},
            {label  :"Beers",category:"Beers"},
            {label  :"Spirits",category:"Spirits"},
            {label  :"Wine",category:"Wine"}];
         self.getAllProducts=""
// to put into variable !!
            getRecommendedProductsService.getRecommendedProducts().then(function (results) {
                //createRecommendedTable(results.data).then(function () {
                self.recommendedProducts = results.data
                getAllProductsService.getAllProducts2().then(function (results) {
                    self.Products = results.data
                    // console.log(self.Products)
                }, function (error) {
                    self.errorMessage = error.data;
                    console.log('get all products didnt succeed');
                })
            })



        self.addToCart =  CartService.addToCart;

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