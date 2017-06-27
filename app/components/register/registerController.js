/**
 * Created by nitzan on 27/06/17.
 */

angular.module("myApp")
    .controller('registerController', ["registerService", "$location" ,"passwordRetrieveService","$scope" , function (registerService ,$location ,passwordRetrieveService,$scope ) {
        let self = this;
        console.log(self. user)
        self.user = {
            "UserName": '',            "FirstName": '',            "LastName": '',            "Password": '',
            "Address":'',            "City":'',            "Country":'' ,            "Phone": '',
            "Cellular": '',            "Mail": '',            "CreditCardNumber": '',            "Categories" : [],
            "AnswersQ1":'',            "AnswersQ2":'',            "isAdmin": 0            };
        self.Q1=passwordRetrieveService.question_1
        self.Q2=passwordRetrieveService.question_2
            self.register = function(valid){
            if (valid) {
                registerService.register(self.user).then(function (success) {
                    $location.path('/login');
                    console.log(success)
                }, function (errorMsg) {
                    self.errorMessage = errorMsg;
                    console.log(errorMsg)
                })
            }
        }

    }]);