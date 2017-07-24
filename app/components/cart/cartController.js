/**
 * Created by nitzan on 24/07/17.
 */
angular.module("myApp")
    .controller('registerController', ["registerService", "$location" ,"passwordRetrieveService","$scope" , function (registerService ,$location ,passwordRetrieveService,$scope ) {