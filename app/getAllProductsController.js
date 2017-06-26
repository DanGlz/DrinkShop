/**
 * Created by nitzan on 26/06/17.
 */

angular.module("myApp")
    .controller('getAllProductsController', ['getAllProductsService', function (getAllProductsService) {
        let self = this;
        console.log( "check");
        //self.Products = {DrinkName : nitz , DrinkName: robi}

        getAllProductsService.getAllProducts2().then(function (success) {
            self.Products = success.data
        }, function (error) {
            self.errorMessage = error.data;
            console.log('get all products didnt succeed');
        })

    }]);