/**
 * Created by Dan gleyzer on 30-May-17.
 */
var express = require('express'); // Loading the express module to the server.
var app = express(); // activating express
var bodyParser = require('body-parser')


app.listen(3100, function() {
    console.log('I am listening on localhost:3100');
    // server is open and listening on port 3100, to access: localhost:3100 in any browser.
});

app.get('/dan', function (req, res){
    console.log('client connected!');
    // res.send('I got the message');
    // next();
});