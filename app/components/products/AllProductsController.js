/**
 * Created by nitzan on 26/06/17.
 */

angular.module("myApp")
        .controller('getAllProductsController', ['getAllProductsService','$scope','getRecommendedProductsService','CartService','productDetailsService','ngDialog','UserLogInService','$location',
        function (getAllProductsService ,$scope,getRecommendedProductsService ,CartService ,productDetailsService,ngDialog,UserLogInService,$location) {
        let self = this;
            if (!UserLogInService.isLoggedIn){
                $location.path('/');
            }
        self.Products= getAllProductsService.allProducts
        self.recommendedProducts = getRecommendedProductsService.recommendedProducts
        self.filterBy=""
        self.categories= [
            {label :"All", category:""},
            {label  :"Beers",category:"Beers"},
            {label  :"Spirits",category:"Spirits"},
            {label  :"Wine",category:"Wine"}];
         self.getAllProducts=""

            if(self.Products.length===0 || self.recommendedProducts===0) {
                getRecommendedProductsService.getRecommendedProducts().then(function () {
                    self.recommendedProducts = getRecommendedProductsService.recommendedProducts
                    getAllProductsService.getAllProducts().then(function () {
                        self.Products = getAllProductsService.allProducts
                    }, function () {
                        console.log('Failed to get all products!');
                    })
                })
            }

        self.ReadMore =  function (product) {
            productDetailsService.setProduct(product)
            ngDialog.open({
                template: "components/productDetails/productDetails.html",
                controller: 'productDetailsController'
            });
        }
        self.addToCart =  CartService.addToCart;

        self.propertyName = 'DrinkID';
        $scope.reverse = true;
        $scope.src = "http://www.thebeerstore.ca/sites/default/files/styles/brand_hero/public/brand/hero/Paulaner_TBS%20product%20images%202013.jpg?itok=c07a9fzP"

        $scope.sortBy = function(propertyName) {
            if (propertyName == self.propertyName ){
                $scope.reverse =  !$scope.reverse
            }
            self.propertyName = propertyName;
        };
    }]);