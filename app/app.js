
let app = angular.module('myApp', ['ngRoute', 'ngCookies' ,'LocalStorageModule', 'ngDialog']);
//-------------------------------------------------------------------------------------------------------------------
app.config(function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('node_angular_App');
});
//-------------------------------------------------------------------------------------------------------------------
app.controller('mainController', ['UserLogInService', function (UserLogInService) {
    let vm = this;
    UserLogInService.checkCookie();
    vm.userService = UserLogInService;
}]);
//-------------------------------------------------------------------------------------------------------------------
app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix('');
}]);
app.config( ['$routeProvider', function($routeProvider) {
    $routeProvider
        .when("/", {
           // templateUrl : "views/shop.html",
           templateUrl : "components/home/home.html",
            controller : "mainController"
        })
        .when("/login", {
            templateUrl : "components/login/login2.html",
            controller : "UserLoginController"
        })
        .when("/about", {
            templateUrl : "components/about/aboutPage.html",
        })
        .when("/getAllProducts", {
            templateUrl : "components/products/AllProducts.html",
        })
        .when("/register", {
            templateUrl : "components/register/register.html",
        })
        .when("/cart", {
            templateUrl : "components/cart/cart.html",
        })
        .when("/passwordRetrieve", {
            templateUrl : "components/passwordRetrieve/passwordRetrieve.html",
        })
        .when("/PreviousPurchases", {
            templateUrl : "components/PreviousPurchases/PreviousPurchases.html",
        })
        .when("/Purchase", {
            templateUrl : "components/Purchase/Purchase.html",
        })
        .otherwise({redirect: '/',
        });

}]);