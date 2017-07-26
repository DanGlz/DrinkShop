
let app = angular.module('myApp', ['ngRoute', 'ngCookies' ,'LocalStorageModule']);
//-------------------------------------------------------------------------------------------------------------------
app.config(function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('node_angular_App');
});
//-------------------------------------------------------------------------------------------------------------------
app.controller('mainController', ['UserLogInService','$cookies','$filter', function (UserLogInService) {
    let vm = this;
    UserLogInService.checkCookie();
    vm.userService = UserLogInService;
    vm.UserName=UserLogInService.UserName
    vm.lastLoginDate=UserLogInService.lastLoginDate
}]);
//-------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------
app.controller('citiesController', ['$http', 'CityModel', function($http, CityModel) {
        let self = this;
        self.fieldToOrderBy = "name";
        // self.cities = [];
        self.getCities = function () {
            $http.get('/cities')
                .then(function (res) {
                    // self.cities = res.data;
                    //We build now cityModel for each city
                    self.cities = [];
                    angular.forEach(res.data, function (city) {
                        self.cities.push(new CityModel(city));
                    });
                });
        };
        self.addCity = function () {
          let city = new CityModel(self.myCity);
          if (city) {
              city.add();
              self.getCities();
          }
        };
    }]);
//-------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------
app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix('');
}]);
app.config( ['$routeProvider', function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl : "components/home/home.html",
            controller : "mainController"
        })
        .when("/login", {
            templateUrl : "components/login/login.html",
            controller : "UserLoginController"
        })
        .when("/cities", {
            templateUrl : "views/cities.html",
        })
        .when("/StorageExample", {
            templateUrl : "views/StorageExample.html",
        })
        .when("/top5products", {
            templateUrl : "components/home/top5products.html",
        })
        .when("/getAllProducts", {
            templateUrl : "components/products/getAllProducts.html",
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
        .otherwise({redirect: '/',
        });

}]);
//-------------------------------------------------------------------------------------------------------------------
