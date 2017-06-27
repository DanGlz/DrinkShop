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
                    $window.alert('You are logged in');
                    $location.path('/');
                }, function (errorMsg) {
                    self.errorMessage = errorMsg;
                    $window.alert('log-in has failed:' + errorMsg);
                })
            }
        };
    }]);