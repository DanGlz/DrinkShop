var express = require('express'); // Loading the express module to the server.
var DbUtils = require("../DbUtils.js");
var router = express.Router();
var bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());
let server = require("../server.js");
let squel = require("squel");


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
//add a new product by the admin
router.post('/AddProduct',function(req,res){
    if(! checkIfAdminConnected(req)){
        res.send("only admins can add products");
        return ;
    }
    let AddProductQuery =DbUtils.AddProductQuery(req);
    DbUtils.Insert(AddProductQuery). // insert
    then(function () {
        res.send(true)

    }).catch(function (err) {
        console.log(err.message);
        res.send(false);
    })
});
// delete a prodact by an admin
router.post('/DeleteProduct',function(req,res) {
    if (!checkIfAdminConnected(req)) {
        res.send("only admins can delete products");
        return;
    }
    let DeleteProductQuery = DbUtils.DeleteProductQuery(req.body.DrinkId);
    DbUtils.Insert(DeleteProductQuery).// insert
    then(function (DrinkID) {
        console.log("jg "+DrinkID)
        if (Object.keys(DrinkID).length > 0){
            res.send(true)
        }else{
            res.send(false)
        }
    }).catch(function (err) {
        console.log(err.message);
        res.send(false)
    })

});
router.post('/DeleteClient',function(req,res) {
    if (!checkIfAdminConnected(req)) {
        res.send("only admins can delete products");
        return;
    }
    let DeleteClientQuery = DbUtils.DeleteClientQuery(req.body.ClientId);
    DbUtils.Insert(DeleteClientQuery).// insert
    then(function (clientId) {
        if (Object.keys(DrinkID).length > 0) {
            res.send(true)
        } else {
            res.send(false)
        }
    }).catch(function (err) {
        console.log(err.message);
        res.send(false)
    })
})
// change the inventory of a product
router.post('/changeProductInventory',function(req,res) {
    if (!checkIfAdminConnected(req)) {
        res.send("only admins can delete products");
        return;
    }
    let changeProductInventoryQuery=DbUtils.changeProductInventoryQuery(req.body.DrinkId, req.body.newInventory);
    DbUtils.Insert(changeProductInventoryQuery).// insert
    then(function (StockAmount) {
        if (Object.keys(StockAmount).length > 0){
            res.send(true)
        }else{
            res.send(false)
        }
    }).catch(function (err) {
        console.log(err.message);
        res.send(true)
    })
});
//get all the stock in the DB
router.get('/GetStockDetails',function(req,res){
    if (!checkIfAdminConnected(req)) {
        res.send("only admins can Get Stock Details");
        return;
    }
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
    if (!checkIfAdminConnected(req)) {
        res.send("only admins can Get Orders Details");
        return;
    }
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
