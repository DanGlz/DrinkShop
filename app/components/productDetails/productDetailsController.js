/**
 * Created by nitzan on 03/08/17.
 */

angular.module("myApp")
    .controller('productDetailsController', ['productDetailsService','$scope','CartService',
        function (productDetailsServics ,$scope,cartService) {
            var self = this;
            $scope.src = "http://www.hinnawi.org.il/wp-content/uploads/%D7%91%D7%99%D7%A8%D7%94-%D7%92%D7%95%D7%9C%D7%93%D7%A1%D7%98%D7%90%D7%A8-%D7%9C%D7%90-%D7%9E%D7%A1%D7%95%D7%A0%D7%9F-330-%D7%91%D7%A7%D7%91%D7%95%D7%A7-280x280.png"
            self.product = productDetailsServics.getProduct() ;
            self.addToCart = cartService.addToCart;
            self.deleteFromCart=cartService.deleteFromCart;

        }]);
