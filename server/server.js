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
let Orders = require('./routes/Orders');
let Admin = require('./routes/Admin');


let DbUtils = require("./DbUtils.js");
let server = require("./server.js");
app.use(express.static(__dirname+'/../app'));

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
    let loggedIn=server.CheckCookie(req);
    //ToDO to decide here about the logic
    if(loggedIn) {
        req.userloggedIn = true;
        updateCookie(req,res);
        next();
    }
    else{
        next();
    }
}  )
app.use("/Products",products);
app.use("/Orders",Orders);
app.use("/Admin",Admin);

exports.GetDate =function () {
    let dateFormat = require('dateformat');
    let now = new Date();
    let date = dateFormat(now, "d/m/yy");
    return date;
}
exports.createCookie =function (ClientID,res,isAdmin, username){

    let cookieObj= {
        cookieData:{ClientID: ClientID, LastLoginDate: " ",CurrentLoginDate:server.GetDate(),Admin:isAdmin, UserName:username }
    }
    res.cookie("DrinkShop",cookieObj)

}
exports.CheckCookie =function (req) {
    let cookie = req.cookies['DrinkShop'];
    if(!cookie)
        return false;
    else
        true;

   return true;
}
//get the user id from the cookie
exports.GetClientIdFromCookie =  function (req) {
   return req.cookies['DrinkShop'].cookieData.ClientID;
}
exports.GetUserNameFromCookie=function (req) {
    return req.cookies['DrinkShop'].cookieData.UserName;
}



GetLogInData = function (req){
    return new Promise(function (resolve, reject) {
        let ans;
        GetTopFiveProducts().then(function (TopFiveProducts){
            GetLastMonthProducts().then(function (LastMonthProducts) {

               var LastLogin = req.cookies['DrinkShop'];
              if(LastLogin=== undefined) {
                  LastLogin = "";
              }
                else {
                  LastLogin = req.cookies['DrinkShop'].cookieData.LastLoginDate;
              }
                  ans = {
                      Status: true,
                      NewestProducts: LastMonthProducts,
                      Top5Products: TopFiveProducts,
                      LastLoginDate: LastLogin,
                      CurrencyRate: 3.4}
                resolve(ans);
            })
        }). catch(function (err) {

             let ans2 =
                {   Status: false,
                    NewestProducts:[],
                    Top5Products:[],
                    LastLoginDate: [],
                    CurrencyRate: 3.4
                }
            //console.log(ans);
            reject(ans2)
    })
    });
}
//log in
app.post('/LogIn',function (req,res,next) {

    if (!req.userloggedIn) {
        let UserName = req.body.UserName;
        let Password = req.body.Password;
        //console.log(UserName+" "+Password);
        logRequest(UserName, Password, res, req).then(function () {
            GetLogInData(req).then(function (ans) {
                res.send({Status:true ,Data : ans})
            })

        }).catch(function (ans) {
            ans={}
            res.send({Status: false ,Data : ans})
        })
    }
    else {
        GetLogInData(req).then(function (ans) {
            res.send({Status:true ,Data : ans});
        })
    }
});
// sets here the login if correct details and also set the cookie
function logRequest(username, pswd ,res, req) {
    return new Promise(function (resolve, reject) {
        let ClientIDQuery = DbUtils.ClientIDLoginQuery(username,pswd);
        DbUtils.Select(ClientIDQuery).then(function (ClientID) {
            if (Object.keys(ClientID).length > 0) {
                if (ClientID[0].isADmin=='1') {
                    server.createCookie(ClientID[0].ClientID, res, true,username);
                    console.log("admin");
                }else {
                    server.createCookie(ClientID[0].ClientID, res, false,username);
                    console.log("not admin");
                }
                resolve();
            }
            else {
                reject();
            }
        }).catch(function () {

            reject();
        })
    })
}


GetTopFiveProducts = function() {
    return new Promise(function(resolve,reject) {
        let query = DbUtils.TopFiveProductsQuery();
        DbUtils.Select(query).then(function (TopFiveProductsID) {
            resolve(TopFiveProductsID);
        }).catch(function (err) {
            reject(err.message);
        })
    });
};

GetLastMonthProducts = function() {
    return new Promise(function(resolve,reject) {
        let query = DbUtils.GetProductsFromLastMonth();
        DbUtils.Select(query).then(function (LastMonthProducts) {
            resolve(LastMonthProducts) ;
        }).catch(function (err) {
            reject(err.message);
        })
    });
};


// get the current date in format of d/m/yy



function updateCookie(req,res){

    let ClientID= server.GetClientIdFromCookie(req);
    let isAdmin=checkIfAdminConnected(req);
    let username= server.GetUserNameFromCookie(req);
    let lastLogin= getLastLoginDate (req);
    let cookieObj= {
        cookieData:{ClientID: ClientID, LastLoginDate: lastLogin,CurrentLoginDate:server.GetDate(),Admin:isAdmin, UserName:username }
    }
    res.cookie("DrinkShop",cookieObj)
}

function getLastLoginDate(req) {
    return req.cookies['DrinkShop'].cookieData.CurrentLoginDate;
}

function checkIfAdminConnected (req){
    let cookie = req.cookies['DrinkShop'];
    if (cookie){
       if(req.cookies['DrinkShop'].cookieData.Admin)
       {
           return true ;
       }
    }
    return false ;
}
//Register
app.post('/Register', function (req,res,next) {
        let UserName= req.body.UserName;
        console.log(UserName);
        if(UserName===undefined){
            let ans= {Status: false,Message : "Register failed, wrong parameters!" }
            res.send(ans)
        }
        else {
            let qeury = DbUtils.ClientRecordRegisterQuery(UserName); // get query
            DbUtils.Select(qeury)
                .then(function (records) {
                    if (Object.keys(records).length < 1) {
                        var body = req.body;
                        qeury = DbUtils.registerQuery(body);
                        // insert new client
                        DbUtils.Insert(qeury).then(function () {
                            let categories = req.body.Categories;
                            let ClientIDQuery = DbUtils.ClientIdFromUserNameQuery(UserName); // get client id from user name
                            DbUtils.Select(ClientIDQuery).// get ClientID
                            then(function (ClientID) {
                                if (categories.length > 0) {
                                    let fields = [];
                                    categories.forEach(function (category) {  // add all categories to the fields
                                        let item = {ClientID: ClientID[0].ClientID, CategoryName: category};
                                        fields.push(item)
                                    })
                                    var InsertCategoryQeury = squel.insert() // create  insert query
                                        .into("[dbo].[ClientCategory]")
                                        .setFieldsRows(fields).toString();
                                    DbUtils.Insert(InsertCategoryQeury).// insert
                                    then(function () {
                                        let ans = {
                                            Status: true,
                                            Message: "New client was created with Client ID: " + ClientID[0].ClientID
                                        };
                                        res.send(ans);
                                    })
                                }else {
                                    let ans = {
                                        Status: true,
                                        Message: "New client was created with Client ID: " + ClientID[0].ClientID
                                    };
                                    res.send(ans);
                                }
                            })
                        })
                    } else {
                        let ans = {Status: false, Message: "The User Name already in use"}
                        res.send(ans)
                    }
                }).catch(function (err) {
                let ans = {Status: false, Message: err.message}
                res.send(ans)
            })

        }
})
//password retrieve
app.post('/PasswordRetrieve',function (req,res) {
// TODO to remove this later..
        let UserName = req.body.UserName;
        let AnswersQ1 = req.body.AnswersQ1;
        let AnswersQ2 = req.body.AnswersQ2;
        let PasswordRetQuery=DbUtils.PasswordRetrieveQuery(UserName,AnswersQ1,AnswersQ2);
        DbUtils.Select(PasswordRetQuery).then(function (password) {
            let ans
            if(Object.keys(password).length>0) {
                ans={Status:true, Password:password[0].Password };
               res.send(ans);
           }
           else {
                ans = {Status: false, Password: ""};
                res.send(ans)
            }
        }).catch(function (err) {
            console.log(err.message);
        })

});
/*
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
*/
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
// get all the catgorys from the db
app.get("/getCatgoryTable",function (req,res){
    let quary = DbUtils.GetCatgoryTable();
    DbUtils.Select(quary).then(function (CatgoryTable){
        if(Object.keys(CatgoryTable).length>0) {
            res.send(CatgoryTable);
        }
        else
            res.send("there is no Catgory in the DB ")
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
