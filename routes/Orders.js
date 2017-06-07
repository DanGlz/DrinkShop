var express = require('express'); // Loading the express module to the server.
var DbUtils = require("../DbUtils.js");
var router = express.Router();
var bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());


// get all the past order of a user
router.get('/GetPastOrders' , function (req,res) {
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
router.post('/MakeOrder',function(req,res){
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
            let query = DbUtils.updateStockAmount(req.body.ListOfProducts, StockNumbersUpdate);
            DbUtils.Insert(query)
                .then(() => {
                    let query = DbUtils.updateStockAmount(req.body.ListOfProducts, StockNumbersUpdate);
                    DbUtils.Insert(query)
                    let fields = [];
                    for (var i = 0; i < req.body.ListOfProducts.length; i++) {
                        let item = {
                            ClientId: clientID,
                            DrinkId: req.body.ListOfProducts[i],
                            CategoryName: req.body.CategoryName[i]
                            ,
                            Quantity: req.body.ListOfQuantity[i],
                            PurchaseDate: GetDate(),
                            Currency: req.body.currency
                            ,
                            Price: req.body.Price[i]
                        };
                        fields.push(item)
                    }
                    var InsertOrderQeury = squel.insert() // create  insert query
                        .into("[dbo].[Orders]")
                        .setFieldsRows(fields).toString();
                    DbUtils.Insert(InsertOrderQeury) // insert
                        .then(function () {
                            res.send("The order was successful");
                        }).catch(function (err) {
                        console.log(err.message);
                    })
                }).catch(function (err) {
                console.log(err.message);
            })
        }).catch(function (err) {
            console.log(err.message);
        })
    }
});
//get all the stock in the DB
router.get('/GetStockDetails',function(req,res){
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
//get all the orders in the DB
router.get('/GetOrdersDetails',function(req,res){
    let GetOrdersDetailsQuary = DbUtils.GetOrdersDetailsQuary();
    DbUtils.Select(GetOrdersDetailsQuary).then(function (OrdersDetails) {
        if(Object.keys(OrdersDetails).length>0) {
            res.send(OrdersDetails);
        }
        else {
            res.send("there is no stock ");
        }
    }).catch(function (err) {
        console.log(err.message);
    })
});

module.exports = router;













