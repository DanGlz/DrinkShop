/**
 * Created by nitzan on 25/07/17.
 */


angular.module("myApp").factory('addDeleteCartItemService', ['localStorageService','$window','UserLogInService',
    function(localStorageService,$window ,UserLogInService) {

    let service = {};
    service.addToCart = function (product ){
       if (parseInt(product.StockAmount) < parseInt(product.amount)) {
           $window.alert(" the stock for this item is only "+product.StockAmount+", you cant order "+product.amount)
           return
       }
        UserLogInService.checkCookie() ;
       let key = "cart " + UserLogInService.ClientID+ " " +product.DrinkID
        let valueStored = localStorageService.get(key);
        //console.log (product.amount)
        if (!valueStored) {
            if (localStorageService.set(key, product))
                $window.alert("the drink " +product.DrinkName + " added successfully to the your cart");
            else
                console.log('failed to add data to cart');
        }
        else {
            var tmp = localStorageService.get(key);
            tmp.amount = parseInt(tmp.amount)+ parseInt(product.amount)
            if (tmp.StockAmount < tmp.amount) {
                $window.alert(" the stock for this item is only "+product.StockAmount + " you have in youre cart "+ localStorageService.get("cart "+product.DrinkID).amount+" alredy")
                return
            }
            localStorageService.remove(key);
            localStorageService.set(key, tmp)
            $window.alert("we added " + product.amount + " more of " + product.DrinkName + " to your cart ");
        }
    }


    service.deleteFromCart = function (product){
        UserLogInService.checkCookie() ;
        let key = "cart " + UserLogInService.ClientID+ " " +product.DrinkID
        let valueStored = localStorageService.get(key);
        if (valueStored) {
            localStorageService.remove(key);
        }
        else
            $window.alert('failed to delete the data');
    }
    return service;
}]);

