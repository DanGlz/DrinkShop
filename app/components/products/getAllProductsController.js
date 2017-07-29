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
        $scope.src = "http://www.thebeerstore.ca/sites/default/files/styles/brand_hero/public/brand/hero/Paulaner_TBS%20product%20images%202013.jpg?itok=c07a9fzP"

        $scope.sortBy = function(propertyName) {
            console.log (propertyName)
            if (propertyName == self.propertyName ){
                $scope.reverse =  !$scope.reverse
            }
            self.propertyName = propertyName;
        };
    }]);