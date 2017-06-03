/**
 * Created by Dan gleyzer on 30-May-17.
 */
var Promise = require('promise')
var Request = require('tedious').Request;
let squel = require("squel");


exports.Select=function (connection,query) {
    return new Promise(function (resolve, reject) {
        var req=new Request(query,function (err,rowCount) {
            if(err) {
                console.log('err');
                reject(err.message);
            }
        });
        var res = [] ;
        var properties = [];
        req.on('columnMetadata', function (columns) {
            columns.forEach(function (column) {
                if (column.colName !== null)
                    properties.push(column.colName);
            });
        });
        req.on('row', function (row) {
            var item = {};
            for (i = 0; i < row.length; i++) {
                item[properties[i]] = row[i].value;
            }
            res.push(item)
        });
        req.on('requestCompleted', function () {
            console.log('Select request Completed with ' + req.rowCount + ' rows');
            console.log(res);
            resolve(res);
        });
        connection.execSql(req);
    });
}

exports.Insert = function (connection,query) {
    return new Promise(function (resolve, reject) {
    var req = new Request(query, function (err, rowCount) {
            if (err) {
              reject(err);
            }
            req.on('requestCompleted', function () {
               resolve('Insert request Completed with ' + req.rowCount + ' row(s)')
            });
        });
        connection.execSql(req);
    })
}

//register (insert)
exports.registerQuery=function(body){

    let query = squel.insert()  // set Query for Client Insert
        .into("[dbo].[clients]")
        .set("UserName", body.UserName)
        .set("FirstName", body.FirstName)
        .set("LastName", body.LastName)
        .set("Password", body.Password)
        .set("Address", body.Address)
        .set("City", body.City)
        .set("Country", body.Country)
        .set("Phone", body.Phone)
        .set("Cellular", body.Cellular)
        .set("Mail", body.Mail)
        .set("CreditCardNumber", body.CreditCardNumber)
        .toString();

    return query;
}

// select ClientID from given user name and password
exports.ClientIDLoginQuery=function (UserName,Password) {
    let ClientIDQuery = squel.select().field("ClientID") // set Query for selecting user ID after validating UserName and Password
        .from("[dbo].[clients]")
        .where("UserName ='" + UserName + "'")
        .where("Password ='" + Password + "'")
        .toString();

    return ClientIDQuery;
}

// select from given user name- to check if username exist
exports.ClientRecordRegisterQuery=function (UserName) {
    let ClientRecordQuery = squel.select()
        .from("[dbo].[clients]")
        .where("UserName='"+UserName+"'")
        .toString();
    return ClientRecordQuery;
}

exports.ClientIdFromUserNameQuery= function (UserName) {
    let ClientIdQuery= squel.select().field("ClientID") // set Query for selecting user ID
        .from("[dbo].[clients]").
        where("UserName='"+UserName+"'")
        .toString();
    return ClientIdQuery;


}

