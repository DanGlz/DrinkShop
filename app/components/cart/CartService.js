/**
 * Created by nitzan on 25/07/17.
 */


angular.module("myApp").factory('CartService', ['localStorageService','$window','UserLogInService',
    function(localStorageService,$window ,UserLogInService) {

    let service = {};
    service.addToCart = function (product ){
        if(parseInt(product.amount)) {
            if (parseInt(product.StockAmount) < parseInt(product.amount)) {
                $window.alert("The stock for this item is " + product.StockAmount + ", you can`t order " + product.amount + " items")
                return
            }
            UserLogInService.checkCookie();
            let key = "cart " + UserLogInService.ClientID + " " + product.DrinkID
            let valueStored = localStorageService.get(key);
            //console.log (product.amount)
            if (!valueStored) {
                if (localStorageService.set(key, product))
                    $window.alert("The drink " + product.DrinkName + " was added successfully to your cart");
                else
                    console.log('Failed to add the products to cart');
            }
            else {
                var tmp = localStorageService.get(key);
                tmp.amount = parseInt(tmp.amount) + parseInt(product.amount)
                if (tmp.StockAmount < tmp.amount) {
                    $window.alert("The stock for this item is " + product.StockAmount + ", you already have in your cart " +
                        localStorageService.get("cart " + UserLogInService.ClientID + " " + product.DrinkID).amount + " items \n" +
                        "You can`t exceed the stock amount")
                    return
                }
                localStorageService.remove(key);
                localStorageService.set(key, tmp)
                $window.alert(product.amount + " items of " + product.DrinkName + " was added successfully to the your cart ");
            }
        }
        else{
            $window.alert("Can`t add the product to your card. \n" +
                "You entered illegal value for amount!");
        }
    }


    service.deleteFromCart = function (product){
        UserLogInService.checkCookie() ;
        console.log(product)
        let key = "cart " + UserLogInService.ClientID+ " " +product.DrinkID
        let valueStored = localStorageService.get(key);
        if (valueStored) {
            localStorageService.remove(key);
        }
        else
            $window.alert('Failed to delete the product');
    }
    return service;
}]);

