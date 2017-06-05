var express = require('express'); // Loading the express module to the server.
var DbUtils = require("../DbUtils.js");
var router = express.Router();
var bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());



//GET all products.
router.get('/allProducts', function(req, res) {

let query = DbUtils.AllProductsQuery();

DbUtils.Select(query).then(function (AllDrinkProducts) {
  res.send(AllDrinkProducts) ;
}).catch(function (err) {
    res.send(err.message);
})

});


//GET Top 5 Products
router.get('/TopFiveProducts', function(req, res) {

    let query = DbUtils.TopFiveProductsQuery();
    DbUtils.Select(query).then(function (TopFiveProductsID) {
        res.send(TopFiveProductsID) ;
    }).catch(function (err) {
        res.send(err.message);
    })
});

//GET Top 5 Products
router.get('/RecommendedProducts', function(req, res) {

    let userID =req.cookies['DrinkShop'].ClientID;
    let query = DbUtils.RecommendedProductsQuery(userID);
    DbUtils.Select(query).then(function (TopFiveProductsID) {
        res.send(TopFiveProductsID) ;
    }).catch(function (err) {
        res.send(err.message);
    })
});





module.exports = router;
