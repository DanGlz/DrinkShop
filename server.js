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
let Products = require("./routes/products.js");
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
        updateCookie(req,res);
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

GetLogInData = function (req){
    return new Promise(function (resolve, reject) {
        let ans;
        GetTopFiveProducts().then(function (TopFiveProducts){
            GetLastMonthProducts().then(function (LastMonthProducts) {

               var LastLogin = req.cookies['DrinkShop'];
              if(LastLogin=== undefined)
                   LastLogin= "";
                else
                    LastLogin=req.cookies['DrinkShop'].LastLoginDate;
                 ans =
                    {   Status: true,
                        NewestProducts:LastMonthProducts,
                        Top5Products:TopFiveProducts,
                        LastLoginDate:"",
                        CurrencyRate: 3.4
                    }
                console.log(ans);

            })
            resolve(ans);
        }). catch()
        {
             ans =
                {   Status: false,
                    NewestProducts:[],
                    Top5Products:[],
                    LastLoginDate: [],
                    CurrencyRate: 3.4
                }
            console.log(ans);
            reject(ans)
        }
    });
}


//log in
app.post('/LogIn',function (req,res,next) {
    if (!req.userloggedIn){ // TODO to remove this later..
        let ans;
        let UserName = req.body.UserName;
        let Password = req.body.Password;
        //console.log(UserName+" "+Password);
    logRequest(UserName, Password, res, req).then(function () {
        GetLogInData(req).then(function (ans) {
            console.log("check!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            res.send(ans)
        })
        // TODO to send products?
    }).catch(function (ans) {
        console.log("check  errror!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        res.send(ans)
    })
}
else {

        GetLogInData(req).then(function (ans) {
            console.log("check 2!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            res.send(ans)
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
                    createCookie(ClientID[0].ClientID, res, true);
                    console.log("admin");
                }else {
                    createCookie(ClientID[0].ClientID, res, false);
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
function GetDate() {
    let dateFormat = require('dateformat');
    let now = new Date();
    let date = dateFormat(now, "d/m/yy");
    return date;
}

function createCookie(ClientID,res,isAdmin){

        res.cookie("DrinkShop", {ClientID: ClientID, LastLoginDate: GetDate(),Admin:isAdmin })


}

function updateCookie(req,res){

    let ClientID= GetClientIdFromCookie(req);
    let isAdmin=checkIfAdminConnected(req);
    res.cookie("DrinkShop", {ClientID: ClientID, LastLoginDate: GetDate(),Admin:isAdmin })
}
function checkIfAdminConnected (req){
    let cookie = req.cookies['DrinkShop'];
    if (cookie){
       if(req.cookies['DrinkShop'].Admin)
       {
           return true ;
       }
    }
    return false ;
}
//Register
app.post('/Register', function (req,res,next) {
        let UserName= req.body.UserName;
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
                        DbUtils.Insert(qeury).then(function (ClientInsert_message) {
                            let summaryMessage = ClientInsert_message
                            let categories = req.body.Categories;

                            let ClientIDQuery = DbUtils.ClientIdFromUserNameQuery(UserName); // get client id from user name
                            DbUtils.Select(ClientIDQuery).// get ClientID
                            then(function (ClientID) {
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
// make an order, checks if the order is in stock before
app.post('/MakeOrder',function(req,res){
    let StockNumbersUpdate = [];
    if (!CheckCookie(req)) {
        res.send("You need to login first");
    }
    else {

        let clientID = GetClientIdFromCookie(req);
        let query = DbUtils.MakeOrderCheckStokQuery(req.body.ListOfProducts, req.body.ListOfQuantity);
        DbUtils.Select(query).then(function (Prodactes) {
            if (Object.keys(Prodactes).length == req.body.ListOfProducts.length) {

                for (var i = 0; i < Object.keys(Prodactes).length; i++) {

                    let parseStockAmount = parseInt(Prodactes[i].StockAmount);
                    let parseQuantity = parseInt(req.body.ListOfQuantity[i]);
                    if (parseStockAmount < parseQuantity) {
                        res.send("the Product " + req.body.ListOfProducts[i] + " is not in stock");
                        reject();
                    } else {
                        let a = parseStockAmount - parseQuantity;
                        StockNumbersUpdate.push(a);
                    }

                }
            }
        }).then(() => {
            let fields = [];
            for (var i = 0; i < req.body.ListOfProducts.length; i++) {
                let item = {
                    ClientId: clientID, DrinkId: req.body.ListOfProducts[i], CategoryName: req.body.CategoryName[i]
                    , Quantity: req.body.ListOfQuantity[i], PurchaseDate: GetDate(), Currency: req.body.currency
                    , Price: req.body.Price[i]
                };
                fields.push(item)
            }
            var InsertOrderQeury = squel.insert() // create  insert query
                .into("[dbo].[Orders]")
                .setFieldsRows(fields).toString();
            DbUtils.Insert(InsertOrderQeury) // insert
                .then(() => {
                  /*  for (var i = 0; i < req.body.ListOfProducts.length; i++) {

                        DbUtils.Insert(DbUtils.updateStockAmount1(req.body.ListOfProducts[i], StockNumbersUpdate[i]));
                    }*/
                    //let query = DbUtils.updateStockAmount(req.body.ListOfProducts, StockNumbersUpdate);
                    // DbUtils.Insert(query)
                }).then(function () {
                res.send("The order was successful");
            })

        })
    }
    });

app.get('/GetStockDetails',function(req,res){
    let GetStockDetailsQuary = DbUtils.GetStockDetails();
    DbUtils.Select(GetStockDetailsQuary).then(function (StockDetails) {

        if(Object.keys(StockDetails).length>0) {
            res.send(StockDetails);
        }
        else
            res.send("there is no stock ")
    }).catch(function (err) {
        console.log(err.message);
    })
});
//add product by the admin
app.post('/AddProduct',function(req,res){
    if(! checkIfAdminConnected(req)){
       res.send("only admins can add products");
       return ;
   }
let AddProductQuery =DbUtils.AddProductQuery(req);
    DbUtils.Insert(AddProductQuery). // insert
    then(function () {
        res.send("Product added successfully")

    }).catch(function (err) {
        console.log(err.message);
        res.send("Product didn't added successfully")
    })
});

app.post('/DeleteProduct',function(req,res) {
    if (!checkIfAdminConnected(req)) {
        res.send("only admins can delete products");
        return;
    }
    let DeleteProductQuery = DbUtils.DeleteProductQuery(req.body.DrinkId);
    DbUtils.Insert(DeleteProductQuery).// insert
    then(function (DrinkID) {
        console.log("jg "+DrinkID)
        if (Object.keys(DrinkID).length > 0){
            res.send("Product deleted successfully")
        }else{
            res.send("Product does not exist in the system")
        }
    }).catch(function (err) {
        console.log(err.message);
        res.send("Product didn't deleted successfully")
    })

});
app.post('/DeleteClient',function(req,res) {
    if (!checkIfAdminConnected(req)) {
        res.send("only admins can delete products");
        return;
    }
    let DeleteClientQuery = DbUtils.DeleteClientQuery(req.body.ClientId);
    DbUtils.Insert(DeleteClientQuery).// insert
    then(function (clientId) {
        if (Object.keys(DrinkID).length > 0) {
            res.send("Client deleted successfully")
        } else {
            res.send("Client does not exist in the system")
        }
    }).catch(function (err) {
        console.log(err.message);
        res.send("Client didn't deleted successfully")
    })
})
app.post('/changeProductInventory',function(req,res) {
    let changeProductInventoryQuery=DbUtils.changeProductInventoryQuery(req.body.DrinkId, req.body.newInventory);
    DbUtils.Insert(changeProductInventoryQuery).// insert
    then(function (StockAmount) {
        if (Object.keys(StockAmount).length > 0){
            res.send("Drink Inventory was updated successfully")
        }else{
            res.send("Drink id isn't in the system ")
        }
    }).catch(function (err) {
        console.log(err.message);
        res.send("Drink Inventory wasn't updated successfully")
    })
});