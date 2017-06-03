/**
 * Created by Dan gleyzer on 30-May-17.
 */
let express = require('express'); // Loading the express module to the server.
let app = express(); // activating express
let bodyParser = require('body-parser')
let cors= require('cors');
let Connection =require('tedious').Connection;
let request = require('tedious').Request;
let squel = require("squel");
let cookieParser = require('cookie-parser');
let users = require('./routes/users');
let DbUtils = require("./DbUtils.js");

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());


app.use("/users",users);

//<editor-fold desc="Server Connection and DataBase">
// server is open and listening on port 3100, to access: localhost:3100 in any browser.
app.listen(3100, function() {
    console.log('I am listening on localhost:3100');
});

var config={    userName: 'dangl',
                password: 'danDB123',
                server: 'gleyzer.database.windows.net',
                requestTimeout:30000,
                options:{encrypt:true, database: 'DanDB'}
};

let connection = new Connection(config);

// connect to database
connection.on('connect',function (err) {
    if(err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected to Azure!')
});

//</editor-fold>


// happens each connection to the server - cookie check
app.use("/",function (req,res,next) {
    let loggedIn= CheckCookie(req);
    //ToDO to decide here about the logic
    if(loggedIn) {
        req.userloggedIn = true;
        res.send("The server Found Cookie of Client " +
           req.cookies['DrinkShop'].ClientID +
           " last log in on : " + req.cookies['DrinkShop'].LastLoginDate)
        next();
    }
    else{
        next();
    }
}  )

function CheckCookie(req) {
    let cookie = req.cookies['DrinkShop'];
    if(!cookie)
        return false;
    else
        true;

   return true;
}

//log in
app.post('/logIn',function (req,res,next) {
    if (!req.userloggedIn){ // TODO to remove this later..
        let UserName = req.body.UserName;
        let Password = req.body.Password;
    logRequest(UserName, Password, res, req).then(function () {
        // TODO to send products?
        res.send("You logged in")
    }).catch(function () {
        res.send("Wrong password/UserName")
    })
}
});

// sets here the login if correct details and also set the cookie
function logRequest(username, pswd ,res, req) {
    return new Promise(function (resolve, reject) {
        let userIDQuery = squel.select().field("ClientID") // set Query for selecting user ID after validating UserName and Password
            .from("[dbo].[clients]")
            .where("UserName ='" + username + "'")
            .where("Password ='" + pswd + "'")
            .toString();

        DbUtils.Select(connection, userIDQuery).then(function (ClientID) {
            if (Object.keys(ClientID).length > 0) {
                createCookie(ClientID[0].ClientID, res);
                resolve(true);
            }
            else {
                reject(false);
            }
        }).catch(function () {
            return false;
        })
    })
}
// get the current date in format of d/m/yy
function GetDate() {
    let dateFormat = require('dateformat');
    let now = new Date();
    let date = dateFormat(now, "d/m/yy");
    return date;
}

function createCookie(ClientID,res){
    res.cookie("DrinkShop",{ClientID:ClientID,LastLoginDate:GetDate()});
}



//register
app.post('/register', function (req,res,next) {
        let qeury=squel.select().from("[dbo].[clients]").where("UserName='"+req.body.UserName+"'").toString(); //
DbUtils.Select(connection,qeury)
    .then(function (records) {
        if(Object.keys(records).length<1){
            var body = req.body;
            qeury = DbUtils.registerQuery(body);
            // insert new client
            DbUtils.Insert(connection,qeury).then(function(ClientInsert_message){
                let summaryMessage = ClientInsert_message
                let categories=req.body.Categories;

                let userIDQuery= squel.select().field("ClientID") // set Query for selecting user ID
                    .from("[dbo].[clients]").
                    where("UserName='"+req.body.UserName+"'").toString();
                DbUtils.Select(connection,userIDQuery).// get ClientID
                then(function (ClientID) {
                    let fields = [];
                    categories.forEach(function (category) {  // add all categories to the fields
                        let item = {ClientID:ClientID[0].ClientID, CategoryName:category};
                        fields.push(item)
                })
                    var InsertCategoryQeury = squel.insert() // create  insert query
                        .into("[dbo].[ClientCategory]")
                        .setFieldsRows(fields).toString();
                    DbUtils.Insert(connection,InsertCategoryQeury). // insert
                    then(function (CategoryInsert_message) {
                        summaryMessage= summaryMessage+ "/n"+CategoryInsert_message
                        res.send(summaryMessage);
                    })
            })
        })
        } else
            res.send("The userName already exist")
    }).catch(function (err) {
    res.send(err)
})
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

