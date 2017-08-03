/**
 * Created by Dan gleyzer on 27-Jun-17.
 */
app.controller('UserLoginController', ['UserLogInService', '$location', '$window',
    function(UserLogInService, $location, $window) {
        let self = this;
        self.user = {UserName: '', Password: ''};
        self.wrongDetails =false;

        self.login = function(valid) {
            if (valid) {
                UserLogInService.login(self.user).then(function (success) {
                    self.wrongDetails =true;
                    UserLogInService.checkCookie()
                    $location.path('/');
                }, function () {
                    self.errorMessage = "Wrong log in details!";
                    self.wrongDetails =true;
                })
            }
        };
    }]);