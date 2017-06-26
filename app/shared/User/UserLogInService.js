/**
 * Created by Dan gleyzer on 26-Jun-17.
 */
app.factory('UserLogInService', ['$http', function($http) {
    let service = {};
    service.isLoggedIn = false;
    service.login = function(user) {
        return $http.post('/login', user)
            .then(function(response) {
                let token = response.data;
                $http.defaults.headers.common = {
                    'my-Token': token,
                    'user' : user.username
                };
                service.isLoggedIn = true;
                return Promise.resolve(response);
            })
            .catch(function (e) {
                return Promise.reject(e);
            });
    };
    return service;
}]);