/**
 * Created by Dan gleyzer on 27-Jun-17.
 */
app.controller('UserLoginController', ['UserLogInService', '$location', '$window',
    function(UserLogInService, $location, $window) {
        let self = this;
        self.user = {UserName: '', Password: ''};

        self.login = function(valid) {
            if (valid) {
                UserLogInService.login(self.user).then(function (success) {
                    UserLogInService.checkCookie()
                    $window.alert('You are logged in !');
                    $location.path('/');
                }, function () {
                    self.errorMessage = "Wrong log in details!";
                    $window.alert('Log-in has failed: ' + self.errorMessage);
                })
            }
        };
    }]);