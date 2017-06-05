/**
 * Created by Dan gleyzer on 30-May-17.
 */
let express = require('express'); // Loading the express module to the server.
let app = express(); // activating express
let bodyParser = require('body-parser')
let cors= require('cors');
//let Connection =require('tedious').Connection;
//let request = require('tedious').Request;
let squel = require("squel");
let cookieParser = require('cookie-parser');
let products = require('./routes/products');
let DbUtils = require("./DbUtils.js");

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());


//<editor-fold desc="Server Connection">
// server is open and listening on port 3100, to access: localhost:3100 in any browser.
app.listen(3100, function() {
    console.log('I am listening on localhost:3100');
});
//</editor-fold>

// happens each connection to the server - cookie check
app.use("/",function (req,res,next) {
    let loggedIn= CheckCookie(req);
    //ToDO to decide here about the logic
    if(loggedIn) {
        req.userloggedIn = true;
        console.log("The server Found Cookie of Client " +
           req.cookies['DrinkShop'].ClientID +
           " last log in on : " + req.cookies['DrinkShop'].LastLoginDate)
        next();
    }
    else{
        next();
    }
}  )

app.use("/Products",products);

function CheckCookie(req) {
    let cookie = req.cookies['DrinkShop'];
    if(!cookie)
        return false;
    else
        true;

   return true;
}
//get the user id from the cookie
function GetClientIdFromCookie(req) {
   return req.cookies['DrinkShop'].ClientID;
}
//log in
app.post('/LogIn',function (req,res,next) {
    if (!req.userloggedIn){ // TODO to remove this later..
        let UserName = req.body.UserName;
        let Password = req.body.Password;
        console.log(UserName+" "+Password);
    logRequest(UserName, Password, res, req).then(function () {
        // TODO to send products?
        res.send("You logged in")
    }).catch(function () {
        res.send("Wrong password/UserName")
    })
}
});

// sets here the login if correct details and also set the cookie
function logRequest(username, pswd ,res, req) {
    //console.log("nitz")
    return new Promise(function (resolve, reject) {
        let ClientIDQuery = DbUtils.ClientIDLoginQuery(username,pswd);
        DbUtils.Select(ClientIDQuery).then(function (ClientID) {
            if (Object.keys(ClientID).length > 0) {
                //console.log(Object.keys(ClientID).length);
                createCookie(ClientID[0].ClientID, res);
                resolve(true);
            }
            else {
                reject(false);
            }
        }).catch(function () {

            return false;
        })
    })
}
// get the current date in format of d/m/yy
function GetDate() {
    let dateFormat = require('dateformat');
    let now = new Date();
    let date = dateFormat(now, "d/m/yy");
    return date;
}

function createCookie(ClientID,res){
   res.cookie("DrinkShop",{ClientID:ClientID,LastLoginDate:GetDate()});
}

//Register
app.post('/Register', function (req,res,next) {
        let UserName= req.body.UserName;
        let qeury= DbUtils.ClientRecordRegisterQuery(UserName); // get query
DbUtils.Select(qeury)
    .then(function (records) {
        if(Object.keys(records).length<1){
            var body = req.body;
            qeury = DbUtils.registerQuery(body);
            // insert new client
            DbUtils.Insert(qeury).then(function(ClientInsert_message){
                let summaryMessage = ClientInsert_message
                let categories=req.body.Categories;

                let ClientIDQuery= DbUtils.ClientIdFromUserNameQuery(UserName); // get client id from user name
                DbUtils.Select(ClientIDQuery).// get ClientID
                then(function (ClientID) {
                    let fields = [];
                    categories.forEach(function (category) {  // add all categories to the fields
                        let item = {ClientID:ClientID[0].ClientID, CategoryName:category};
                        fields.push(item)
                })
                    var InsertCategoryQeury = squel.insert() // create  insert query
                        .into("[dbo].[ClientCategory]")
                        .setFieldsRows(fields).toString();
                    DbUtils.Insert(InsertCategoryQeury). // insert
                    then(function (CategoryInsert_message) {
                        summaryMessage= summaryMessage+ "/n"+CategoryInsert_message
                        res.send(summaryMessage);
                    })
            })
        })
        } else
            res.send("The userName already exist")
    }).catch(function (err) {
    res.send(err)
})
})
//password retrieve
app.post('/PasswordRetrieve',function (req,res) {
// TODO to remove this later..
        let UserName = req.body.UserName;
        let AnswersQ1 = req.body.AnswersQ1;
        let AnswersQ2 = req.body.AnswersQ2;
        let PasswordRetQuery=DbUtils.PasswordRetrieveQuery(UserName,AnswersQ1,AnswersQ2);
        DbUtils.Select(PasswordRetQuery).then(function (password) {
           if(Object.keys(password).length>0) {
               res.send(password[0]);
           }
           else
               res.send("Wrong details for Password Retrieve")
        }).catch(function (err) {
            console.log(err.message);
        })

});
//bring the client the prodact that he looked up
app.post('/SearchProduct',function (req,res) {

    let porductName = req.body.porductName;
    let SearchProductQuery = DbUtils.SearchProductQuery(porductName);
    DbUtils.Select(SearchProductQuery).then(function (prodact){

        if(Object.keys(prodact).length>0) {
            res.send(prodact[0]);
        }
        else
            res.send("there is no such product ")
    }).catch(function (err) {
        console.log(err.message);
    })
});
//get the client information on the prodact he looked up by the name
app.post('/GetInformationOnProductByName',function (req,res){
    let porductName = req.body.porductName;
    let quary = DbUtils.GetInformationOnProductByNameQuery(porductName);
    DbUtils.Select(quary).then(function (prodactInfo){

        if(Object.keys(prodactInfo).length>0) {
            res.send(prodactInfo[0]);
        }
        else
            res.send("there is no such product ")
    }).catch(function (err) {
        console.log(err.message);
    })
});
// get information on prodct by his id
app.post('/GetInformationOnProductByID',function (req,res){
    let porductID = req.body.ID;
    let quary = DbUtils.GetInformationOnProductByIDQuery(porductID);
    DbUtils.Select(quary).then(function (prodactInfo){

        if(Object.keys(prodactInfo).length>0) {
            res.send(prodactInfo[0]);
        }
        else
            res.send("there is no such product ")
    }).catch(function (err) {
        console.log(err.message);
    })
});
// get all the past order of a user
app.get('/GetPastOrders' , function (req,res) {
    if (!CheckCookie(req)) {
        res.send("You need to login first");
    }
    else {
        let clientID = GetClientIdFromCookie(req);
        let GetPastOrdersQuary = DbUtils.GetPastOrdersQuary(clientID);
        DbUtils.Select(GetPastOrdersQuary).then(function (pastOrders) {

            if(Object.keys(pastOrders).length>0) {
                res.send(pastOrders);
            }
            else
                res.send("there is no past orders ")
        }).catch(function (err) {
            console.log(err.message);
        })
    }
});

app.post('/MakeOrder',function(req,res){

    if (!CheckCookie(req)) {
        res.send("You need to login first");
    }
    else {

        let clientID =GetClientIdFromCookie(req);
        for (i in req.ListOfProducts ){
            if(!checkIfInStock(req.ListOfProducts[i], req.ListOfQuantity[i])){
                res.send("the Product"+req.ListOfProducts[i]+"is not in stack");
                return;
            }
        }
        for (i in req.ListOfProducts ){
            console.log("in")
            purchaseProduct(req.ListOfProducts[i],req.ListOfQuantity[i],clientID,req.currency)
            }
        }
        res.send("order completed")

    })
// checks if the item in stcok
function checkIfInStock(itemId ,quantity) {
    let query = DbUtils.checkIfInStock(itemId);
    DbUtils.Select(query).then(function (StockAmount) {
        if (Object.keys(StockAmount).length > 0) {
            if (StockAmount[0] >= quantity) {
                return true;
            }
        }
    }).catch(function (err) {
        return false
    });
}

function purchaseProduct (ProductID ,quantity ,clientID ,currency ){
    let query = DbUtils.purchaseProduct(ProductID,quantity,clientID, GetDate(),currency);
    DbUtils.Insert(qeury).then(function(ClientInsert_message){
        console.log("purchase succsid");
        }).catch(function (err) {
        console.log("purchase faild");
       return false ;
    });
}
