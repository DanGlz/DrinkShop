
let app = angular.module('myApp', ['ngRoute', 'LocalStorageModule' ]);
//-------------------------------------------------------------------------------------------------------------------
app.config(function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('node_angular_App');
});
//-------------------------------------------------------------------------------------------------------------------
app.controller('mainController', ['UserLogInService', function (UserLogInService) {
    let vm = this;
    vm.greeting = 'Have a nice day';
    vm.userService = UserLogInService;
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
            templateUrl : "views/home.html",
            controller : "mainController"
        })
        .when("/login", {
            templateUrl : "views/login.html",
            controller : "UserLoginController"
        })
        .when("/cities", {
            templateUrl : "views/cities.html",
            controller: 'citiesController'
        })
        .when("/StorageExample", {
            templateUrl : "views/StorageExample.html",
            controller: 'StorageExampleController'
        })
        .when("/top5products", {
            templateUrl : "views/top5products.html",
            controller: 'top5productsController'
        })
        .when("/getAllProducts", {
            templateUrl : "views/getAllProducts.html",
            controller: 'getAllProductsController'
        })
        .otherwise({redirect: '/',
        });

}]);
//-------------------------------------------------------------------------------------------------------------------
