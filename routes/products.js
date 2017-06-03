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





module.exports = router;
