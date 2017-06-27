/**
 * Created by Dan gleyzer on 27-Jun-17.
 */
app.factory('passwordRetrieveService', ['$http', function($http) {
    let service = {};
    service.question_1 = "What is your favorite pat?"
    service.question_2 = "What is your favorite movie?"
    service.retrieve = function(retrieveDetails) { //retrieveDetails={ UserName: "" ,AnswersQ1: "" ,AnswersQ2: ""}
        return $http.post('/PasswordRetrieve', retrieveDetails)
            .then(function(response) {
                let data = response.data;
                if(data.Status==true) {
                    service.correctAns = true;
                    return Promise.resolve(data.Password);
                }
                else
                    service.correctAns = false;
                    return Promise.reject("");
            })
            .catch(function (e) {
                return Promise.reject(e.data);
            });
    };
    return service;
}]);