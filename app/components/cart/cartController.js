/**
 * Created by nitzan on 24/07/17.
 */
angular.module("myApp")
    .controller('cartController', ['$http','addDeleteCartItemService','localStorageService','$scope','addDeleteCartItemService',
        function ($http,addDeleteCartItemService ,localStorageService ,$scope,addDeleteCartItemService ) {
        var self = this;
        self.filterBy="";


            var values = [],
                keys = Object.keys(localStorage),
                i = keys.length;

            while ( i-- ) {
                var TMPproduct = JSON.parse(localStorage.getItem(keys[i]))
                values.push(TMPproduct);
                //console.log(JSON.parse(localStorage.getItem(keys[i])).DrinkID)
               // self.totalCost += (parseInt(TMPproduct.amount) * parseInt(TMPproduct.Price))
            }

            self.itemInCart =values
            totalAmount() ;

        self.deleteFromCart = function (product) {
            var index = self.itemInCart.indexOf(product);
            console.log(index)
            self.itemInCart.splice(index, 1);
            addDeleteCartItemService.deleteFromCart(product);
            totalAmount() ;
        }
        function totalAmount(){
            self.totalCost = 0 ;
           for (var i =0 ; i< self.itemInCart.length ; i++) {
               var TMPproduct = self.itemInCart[i]
               self.totalCost += (parseInt(TMPproduct.amount) * parseInt(TMPproduct.Price))
           }
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