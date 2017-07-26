/**
 * Created by nitzan on 25/07/17.
 */


angular.module("myApp").factory('addDeleteCartItemService', ['localStorageService','$window', function(localStorageService,$window) {

    let service = {};
    service.addToCart = function (product ){
        let valueStored = localStorageService.get("cart "+product.DrinkID);
        //console.log (product.amount)
        if (!valueStored) {
            if (localStorageService.set("cart "+product.DrinkID, product))
                $window.alert("the drink " +product.DrinkName + " added successfully to the your cart");
            else
                console.log('failed to add data to cart');
        }
        else {
            var tmp = localStorageService.get("cart "+product.DrinkID);
            tmp.amount = parseInt(tmp.amount)+ parseInt(product.amount)

            localStorageService.remove("cart "+product.DrinkID);
            localStorageService.set("cart "+product.DrinkID, tmp)
            $window.alert("we added " + product.amount + " more of " + product.DrinkName + " to your cart ");
        }
    }
    return service;
}]);

