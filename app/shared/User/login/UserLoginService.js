/**
 * Created by Dan gleyzer on 26-Jun-17.
 */
app.factory('UserLogInService', ['$http', function($http) {
    let service = {};
    service.isLoggedIn = false;
    service.login = function(user) {
        return $http.post('/Login', user)
            .then(function(response) {
                let data = response.data;
                if(data.Status==true) {
                    service.isLoggedIn = true;
                    return Promise.resolve(response);
                }
                else
                    return Promise.reject();
            })
            .catch(function (e) {
                return Promise.reject(e.data);
            });
    };
    return service;
}]);