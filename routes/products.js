var express = require('express'); // Loading the express module to the server.
var DbUtils = require("../DbUtils.js");
var router = express.Router();
var bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());



//GET all products.
router.get('/GetAllProducts', function(req, res) {

let query = DbUtils.AllProductsQuery();

DbUtils.Select(query).then(function (AllDrinkProducts) {
  res.send(AllDrinkProducts) ;
}).catch(function (err) {
    res.send(err.message);
})

});

//GET Top 5 Products
router.get('/GetTopFiveProducts', function(req, res) {
    let query = DbUtils.TopFiveProductsQuery();
    DbUtils.Select(query).then(function (TopFiveProductsID) {
        res.send(TopFiveProductsID) ;
    }).catch(function (err) {
        res.send(err.message);
    })
});

//GET Top 5 Products
exports.GetTopFiveProducts = function() {
    return new Promise(function(resolve,reject) {
    let query = DbUtils.TopFiveProductsQuery();
    DbUtils.Select(query).then(function (TopFiveProductsID) {
        resolve(TopFiveProductsID);
    }).catch(function () {
        reject();
    })
    });
};




//GET Recommended Products
router.get('/GetRecommendedProducts', function(req, res) {
    if(req.userloggedIn) {
        let userID = req.cookies['DrinkShop'].ClientID;
        let query = DbUtils.RecommendedProductsQuery(userID);
        DbUtils.Select(query).then(function (TopFiveProductsID) {
            res.send(TopFiveProductsID);
        }).catch(function (err) {
            res.send(err.message);
        })
    }
    else {
        res.send("You Must Login to get recommendation")
    }
});

//GET last month products

router.get('/LastMonthProducts', function(req, res) {


    let query = DbUtils.GetProductsFromLastMonth();
    DbUtils.Select(query).then(function (LastMonthProducts) {
        res.send(LastMonthProducts) ;
    }).catch(function (err) {
        res.send(err.message);
    })
});


//GET Top 5 Products
exports.GetLastMonthProducts = function() {
    return new Promise(function(resolve,reject) {
        let query = DbUtils.GetProductsFromLastMonth();
        DbUtils.Select(query).then(function (LastMonthProducts) {
            resolve(LastMonthProducts) ;
        }).catch(function (err) {
            reject(err.message);
        })
    });
};



module.exports = router;
