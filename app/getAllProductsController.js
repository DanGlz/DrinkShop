/**
 * Created by nitzan on 26/06/17.
 */

angular.module("myApp")
    .controller('getAllProductsController', ['getAllProductsService','$scope', function (getAllProductsService ,$scope) {
        let self = this;
        console.log( "check");
        //self.Products = {DrinkName : nitz , DrinkName: robi}

        getAllProductsService.getAllProducts2().then(function (success) {
            self.Products = success.data
           // console.log(self.Products)
        }, function (error) {
            self.errorMessage = error.data;
            console.log('get all products didnt succeed');
        })



        self.propertyName = 'DrinkID';
        $scope.reverse = true;

        $scope.sortBy = function(propertyName) {
            if (propertyName == self.propertyName ){
                $scope.reverse =  !$scope.reverse
            }
            self.propertyName = propertyName;
        };
    }]);