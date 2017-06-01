/**
 * Created by Dan gleyzer on 30-May-17.
 */
var express = require('express'); // Loading the express module to the server.
var app = express(); // activating express
var bodyParser = require('body-parser')
var Connection =require('tedious').Connection;
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
var cors= require('cors');
var DbUtils = require("./DbUtils.js");
var request = require('tedious').Request;
var squel = require("squel");
app.use(cors());

var config={    userName: 'dangl',
                password: 'danDB123',
                server: 'gleyzer.database.windows.net',
                requestTimeout:30000,
                options:{encrypt:true, database: 'DanDB'}
};

var connection = new Connection(config);
// connect to database
connection.on('connect',function (err) {
    if(err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected to Azure!')

});

// server is open and listening on port 3100, to access: localhost:3100 in any browser.
app.listen(3100, function() {
    console.log('I am listening on localhost:3100');

});


// happens each connection to the server - log request
app.use(function (req,res,next) {
    var loggedIn= CheckCookie(req); // cookie?
    if(loggedIn)
        next();
    else{
        res.send("Log in failed - no cookie")

    }
}  )

function CheckCookie(cookie) {
   return true;
}

function logRequest(username, pswd) {
    //TODO select from clients where user id and passward match, if not null so log in, return true.
    console.log("Got Log Request with details "+ username + pswd)
    return true;
}

//log in
app.post('/logIn',function (req,res,next) {

    var userName= req.body.username;
    var password= req.body.password;
    var loggedIn = logRequest(userName,password);
     if(loggedIn){
         res.send("You logged in succecfully");
     }
     else{
         res.send("Log in failed: wrong UserName/Password")
     }

});

//register
app.post('/register', function (req,res,next) {
  var qeury = squel.insert();
  qeury.into("[dbo].[clients]")
      .set("UserName","dangl_2")
       .set("Password", "1111111").toString();
  DbUtils.Insert(connection,qeury);
})

app.get('/dan', function (req, res, next){
    console.log("Now on Dan`s Page");
    DbUtils.Select(connection,'Select * from [dbo].[clients] where ClientID = 1')
        .then(function (ans) {
            res.send(ans);
        })
        .catch(function (err) {
            //console.log('error message: ' +err.message);
            res.send(err.message);
        })
});


/**
var s = squel.select();
s.from("[dbo].[clients]");
s.where("ClientID = 1")
console.log( s.toString() );    /* SELECT * FROM [dbo].[clients] where (ClientID = 1) */
