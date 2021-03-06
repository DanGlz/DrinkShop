var express = require('express'); // Loading the express module to the server.
var DbUtils = require("../DbUtils.js");
let squel = require("squel");

var router = express.Router();
var bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

let server = require("../server.js");

// get all the past order of a user
router.get('/GetPastOrders' , function (req,res) {
    console.log("ada")
    if (!server.CheckCookie(req)) {
        res.send("You need to login first");
    }
    else {
        let clientID = server.GetClientIdFromCookie(req);
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
router.post('/MakeOrder',function(req,res){
    let StockNumbersUpdate = [];
    if (!server.CheckCookie(req)) {
        res.send({status: false , message:"You need to login first"}
        );
    }
    else {

        let query = DbUtils.MakeOrderCheckStokQuery(req.body.ListOfProducts, req.body.ListOfQuantity);
        DbUtils.Select(query).then(function (Prodactes) {
            if (Object.keys(Prodactes).length == req.body.ListOfProducts.length) {

                for (var i = 0; i < Object.keys(Prodactes).length; i++) {
                    let parseStockAmount = parseInt(Prodactes[i].StockAmount);
                    let parseQuantity = parseInt(req.body.ListOfQuantity[i]);
                    if (parseStockAmount < parseQuantity) {
                        res.send({status: false , message:"the Product " + req.body.ListOfProducts[i] + " is not in stock"});
                        reject();
                    } else {
                        let a = parseStockAmount - parseQuantity;
                        StockNumbersUpdate.push(a);
                    }

                }
            }
        }).then(() => {
            let query = DbUtils.updateStockAmount(req.body.ListOfProducts, StockNumbersUpdate);
            DbUtils.Insert(query)
                .then(() => {
                    let clientID = server.GetClientIdFromCookie(req);
                    let fields = [];
                    for (var i = 0; i < req.body.ListOfProducts.length; i++) {
                        let item = {
                            ClientId: clientID,
                            DrinkId: req.body.ListOfProducts[i],
                            CategoryName: req.body.CategoryName[i],
                            Quantity: req.body.ListOfQuantity[i],
                            PurchaseDate: server.GetDate(),
                            Currency: req.body.currency,
                            Price: req.body.Price[i]
                        };
                        fields.push(item)
                    }
                    var InsertOrderQeury = squel.insert() // create  insert query
                        .into("[dbo].[Orders]")
                        .setFieldsRows(fields).toString();
                    DbUtils.Insert(InsertOrderQeury) // insert
                        .then(function () {
                            res.send({status: true , message: "The order was successful"});
                        }).catch(function (err) {
                        console.log(err.message);
                        res.send({status: false , message:"Somthing went worng1"});
                    })
                }).catch(function (err) {
                console.log(err.message);
                res.send({status: false , message:"Somthing went worng2"});
            })
        }).catch(function (err) {
            console.log(err.message);
            res.send({status: false , message:"Somthing went worng3"});
        })
    }
});


module.exports = router;













