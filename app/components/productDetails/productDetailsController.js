/**
 * Created by nitzan on 03/08/17.
 */

angular.module("myApp")
    .controller('productDetailsController', ['productDetailsService','$scope','CartService',
        function (productDetailsServics ,$scope,cartService) {
            var self = this;
            self.product = productDetailsServics.getProduct() ;
            self.addToCart = cartService.addToCart;
            self.deleteFromCart=function(product) {

                productDetailsServics.controller.deleteFromCart(product)
            }
        }]);
