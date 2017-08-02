/**
 * Created by nitzan on 24/07/17.
 */
angular.module("myApp")
    .controller('cartController', ['$http','CartService','localStorageService','$scope','UserLogInService',
        function ($http,CartService ,localStorageService ,$scope,UserLogInService ) {
        var self = this;
        self.filterBy="";
        self.categories= [
                {label :"All", category:""},
                {label  :"Beers",category:"Beers"},
                {label  :"Spirits",category:"Spirits"},
                {label  :"Wine",category:"Wine"}];
        self.propertyName = 'DrinkID';
        self.country= [
                {label :"All", category:""},
                {label  :"Israel",category:"Israel"},
                {label  :"Irleand",category:"Irleand"},
                {label  :"Belgian",category:"Belgian"},
                {label  :"Irleand",category:"Irleand"},
                {label  :"Russia",category:"Russia"}];
        cartList()
        function cartList() {
            UserLogInService.checkCookie() ;
            let userId = UserLogInService.ClientID;
            var values = [],
                keys = Object.keys(localStorage),
                i = keys.length;

            while ( i-- ) {

                var Identification = keys[i].split(".")[1].split(" ")
                if (Identification[0] == "cart" && Identification[1] == userId) {
                    var TMPproduct = JSON.parse(localStorage.getItem(keys[i]));
                    values.push(TMPproduct);
                }
            }
            self.itemInCart =values
            totalAmount() ;
        }
        self.deleteFromCart = function (product) {
            var index = self.itemInCart.indexOf(product);
            console.log(index)
            self.itemInCart.splice(index, 1);
            CartService.deleteFromCart(product);
            totalAmount() ;
        }
        function totalAmount(){
            self.totalCost = 0 ;
           for (var i =0 ; i< self.itemInCart.length ; i++) {
               var TMPproduct = self.itemInCart[i]
               self.totalCost += (parseInt(TMPproduct.amount) * parseInt(TMPproduct.Price))
           }
        }

        $scope.reverse = true;
        $scope.src = "http://www.hinnawi.org.il/wp-content/uploads/%D7%91%D7%99%D7%A8%D7%94-%D7%92%D7%95%D7%9C%D7%93%D7%A1%D7%98%D7%90%D7%A8-%D7%9C%D7%90-%D7%9E%D7%A1%D7%95%D7%A0%D7%9F-330-%D7%91%D7%A7%D7%91%D7%95%D7%A7-280x280.png"
        $scope.sortBy = function(propertyName) {
            console.log (propertyName)
            if (propertyName == self.propertyName ){
                $scope.reverse =  !$scope.reverse
            }
            self.propertyName = propertyName;
        };

        self.showAdvanced = function (product) {
            console.log("nitzanmassad@gamil.com")

        }



    }]);