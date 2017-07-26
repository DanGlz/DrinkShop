/**
 * Created by nitzan on 24/07/17.
 */
angular.module("myApp")
    .controller('cartController', ['$http','addDeleteCartItemService','localStorageService','$scope',
        function ($http,addDeleteCartItemService ,localStorageService ,$scope ) {
        var self = this;
        self.totalCost =0 ;
        self.filterBy="";

         cartList() ;
         function cartList (){
            var values = [],
                keys = Object.keys(localStorage),
                i = keys.length;

            while ( i-- ) {
                values.push(JSON.parse(localStorage.getItem(keys[i])));
                //console.log(JSON.parse(localStorage.getItem(keys[i])).DrinkID)
            }

            self.itemInCart =values
             console.log( self.itemInCart);
        }
        self.deleteFromCart = function (product) {

            console.log(product.DrinkID)

        }



        self.propertyName = 'DrinkName';
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