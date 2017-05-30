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
app.use(cors());

var config={    userName: 'dangl',
                password: 'danDB123',
                server: 'gleyzer.database.windows.net',
                requestTimeout:30000,
                options:{encrypt:true, database: 'DanDB'}
};

var connection = new Connection(config);

var request = require('tedious').Request;
var Types = require('tedious').TYPES;


connection.on('connect',function (err) {
    if(err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected to Azure!')


   // queryDataBase()

});

function queryDataBase() {

    var req = new request("Select * from [dbo].[clients] where ClientID = 1", function (err, rowCount, rows) {
        if (err) {
            console.error('Error Message: '+ err.message)
        }
        console.log(rows)
    });

    req.on('row', function (columns) {
        console.log("starts print row:")
        columns.forEach(function (column) {
            console.log("%s\t%s", column.metadata.colName, column.value);
        });
    });
    connection.execSql(req);
}



app.listen(3100, function() {
    console.log('I am listening on localhost:3100');
    // server is open and listening on port 3100, to access: localhost:3100 in any browser.
});

app.get('/dan', function (req, res){
    console.log('*** client connected! ***');
    DbUtils.Select(connection,'Select * from [dbo].[clients] where ClientID = 1')
        .then(function (ans) {
            res.send(ans);
        })
        .catch(function (err) {

            //console.log('error message: ' +err.message);
            res.send(err.message);
        })


});

