/**
 * Created by nitzan on 27/06/17.
 */

angular.module("myApp")
    .controller('registerController', ["registerService", "$location" ,"passwordRetrieveService","$scope" , function (registerService ,$location ,passwordRetrieveService,$scope ) {
        let self = this;
        self.user = {
            "UserName": '',            "FirstName": '',            "LastName": '',            "Password": '',
            "Address":'',            "City":'',            "Country":'' ,            "Phone": '',
            "Cellular": '',            "Mail": '',            "CreditCardNumber": '',            "Categories" : [],
            "AnswersQ1":'',            "AnswersQ2":'',            "isAdmin": 0            };
        self.Q1=passwordRetrieveService.question_1
        self.Q2=passwordRetrieveService.question_2

        //self.catgorys = registerService.getCatgory()
        self.catgorys = ["beer", "wine" ,"Spirits"];
        self.selecteCatgory = function (Catgory) {
          var numInArray = self.user["Categories"].indexOf(Catgory) ;
            if (numInArray===-1){
                self.user["Categories"].push(Catgory);
            }
            else{
                self.user["Categories"].splice(numInArray,1)
            }
        }

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
             if (this.readyState == 4 && this.status == 200) {
                    myFunction(this);
             }
        };
        xmlhttp.open("GET", "countries.xml", true );
        xmlhttp.send();

        function myFunction(xml) {
            var i;
            var xmlDoc = xml.responseXML;
            var temp = [];
            var x = xmlDoc.getElementsByTagName("Country");
            for (i = 0; i <x.length; i++) {
                var json = { "ID" :x[i].getElementsByTagName("ID")[0].childNodes[0].nodeValue.toString(),
                    "Name" :x[i].getElementsByTagName("Name")[0].childNodes[0].nodeValue.toString()}
                temp.push(json);
            }
            self.Countries = temp;
            self.selectedCountry = self.Countries[4];
        }

        self.register = function(valid){
            if (valid) {
                if(/\d/.test(self.user["UserName"])){
                    window.alert("the userName should not include numbers")
                }
                else {
                    registerService.register(self.user).then(function (success) {
                        $location.path('/login');
                        console.log(success)
                    }, function (errorMsg) {
                        self.errorMessage = errorMsg;
                        console.log(errorMsg)
                    })
                }
            }
        }


    }]);