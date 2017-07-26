/**
 * Created by Dan gleyzer on 26-Jun-17.
 */
app.factory('UserLogInService', ['$http','$cookies', function($http,$cookies) {
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

    service.checkCookie= function () {
        var isUserLoggedIn = $cookies.get('DrinkShop')
        if(isUserLoggedIn!= undefined) {
            if(isUserLoggedIn[0]==='j')
                isUserLoggedIn=isUserLoggedIn.substring(2)
            isUserLoggedIn=JSON.parse(isUserLoggedIn)
            service.isLoggedIn = true;
            service.UserName = isUserLoggedIn.cookieData.UserName
            service.lastLoginDate = isUserLoggedIn.cookieData.LastLoginDate
            service.ClientID= isUserLoggedIn.cookieData.ClientID
        }
        else {
            service.isLoggedIn = false;
            service.UserName = "Guest"
        }
    }
    return service;
}]);