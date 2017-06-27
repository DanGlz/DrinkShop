/**
 * Created by Dan gleyzer on 27-Jun-17.
 */
app.controller('passwordRetrieveController', ['passwordRetrieveService',
    function(passwordRetrieveService) {
        let self = this;

        self.passwordRetDetailes = {UserName: '', AnswersQ1: '', AnswersQ2:''};
        self.login = function(valid) {
            if (valid) {
                passwordRetrieveService.retrieve(self.passwordRetDetailes).then(function (password) {
                    $window.alert('You are logged in');
                    $location.path('/');
                }, function (errorMsg) {
                    self.errorMessage = errorMsg;
                    $window.alert('log-in has failed:' + errorMsg);
                })
            }
        };
    }])