/**
 * Created by Dan gleyzer on 27-Jun-17.
 */
app.controller('passwordRetrieveController', ['passwordRetrieveService',
    function(passwordRetrieveService) {
        let self = this;
        self.question_1 = passwordRetrieveService.question_1
        self.question_2 = passwordRetrieveService.question_2
        self.retrievedPassword ="";
        self.wrongDetails="";
        self.correctDetails =false;
        self.wrongDetails =false;
        self.passwordRetDetails = {UserName: '', AnswersQ1: '', AnswersQ2:''};
        self.submit = function() {
            self.correctDetails =false;
            self.wrongDetails =false;
                passwordRetrieveService.retrieve(self.passwordRetDetails).then(function (password) {
                    self.retrievedPassword=password;
                    self.correctDetails = true;
                }, function (errorMsg) {
                    self.wrongDetails=true;
                })

        };
    }])