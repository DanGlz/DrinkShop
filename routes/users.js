var express = require('express'); // Loading the express module to the server.
var DbUtils = require("../DbUtils.js");
var router = express.Router();
var bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());
var squel = require("squel");
var validator = require('validator');


/* GET users listing.
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
*/




module.exports = router;
