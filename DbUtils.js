/**
 * Created by Dan gleyzer on 30-May-17.
 */
var Promise = require('promise')
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
let squel = require("squel");


var config={    userName: 'dangl',
    password: 'danDB123',
    server: 'gleyzer.database.windows.net',
    requestTimeout:30000,
    options:{encrypt:true, database: 'DanDB'}
};

var connection;

exports.Select=function (query) {
    return new Promise(function(resolve,reject) {
        connection = new Connection(config);
        var ans = [];
        var properties = [];
        connection.on('connect', function(err) {
            if (err) {
                console.error('error connecting: ' + err.message);
                reject(err);
            }
            console.log('Azure DB connection on');
            var dbReq = new Request(query, function (err, rowCount) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
            });

            dbReq.on('columnMetadata', function (columns) {
                columns.forEach(function (column) {
                    if (column.colName != null)
                        properties.push(column.colName);
                });
            });
            dbReq.on('row', function (row) {
                var item = {};
                for (i=0; i<row.length; i++) {
                    item[properties[i]] = row[i].value;
                }
                ans.push(item);
            });

            dbReq.on('requestCompleted', function () {
                console.log('Select Completed With : '+ dbReq.rowCount + ' row(s) returned');
                console.log(ans);
                connection.close();
                resolve(ans);
            });
            connection.execSql(dbReq);
        });
    });
}

exports.Insert = function (query) {
    return new Promise(function (resolve, reject) {
        connection = new Connection(config);
        connection.on('connect', function(err) {
            if (err) {
                console.error('error connecting: ' + err.message);
                reject(err);
            }
            console.log('Azure DB connection on');
    var dbReq = new Request(query, function (err, rowCount) {
            if (err) {
              reject(err);
            }
            dbReq.on('requestCompleted', function () {
                console.log('request Completed: '+ dbReq.rowCount + ' row(s) returned');
                connection.close();
                resolve('Insert request Completed with ' + dbReq.rowCount + ' row(s)')
            });
        });
        connection.execSql(dbReq);
    });
    });
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
        .set("AnswersQ1",body.AnswersQ1)
        .set("AnswersQ2",body.AnswersQ2)
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
// set Query for selecting user ID from UserName
exports.ClientIdFromUserNameQuery= function (UserName) {
    let ClientIdQuery= squel.select().field("ClientID")
        .from("[dbo].[clients]").
        where("UserName='"+UserName+"'")
        .toString();
    return ClientIdQuery;

}

exports.AllProductsQuery= function () {
    let AllProductsQuery= squel.select()
        .from("[dbo].[Drinks]")
        .toString();
    return AllProductsQuery;
}

// select Password from given user name and 2 true answers
exports.PasswordRetrieveQuery=function (UserName,AnswersQ1,AnswersQ2) {
    let PasswordRetQuery = squel.select().field("Password") // set Query for selecting user ID after validating UserName and Password
        .from("[dbo].[clients]")
        .where("UserName ='" + UserName + "'")
        .where("AnswersQ1 ='" + AnswersQ1 + "'")
        .where("AnswersQ2 ='" + AnswersQ2 + "'")
        .toString();
    return PasswordRetQuery;
}
exports.SearchProductQuery=function (porductName) {
    let SearchProductQuery = squel.select().field("DrinkName" ) // set Query for selecting user ID after validating UserName and Password
        .from("[dbo].[Drinks]")
        .where("DrinkName ='" + porductName + "'")
        .toString();
    return SearchProductQuery;
}
exports.GetInformationOnProductByNameQuery=function (porductName) {
    let GetInformationOnProductByNameQuery = squel.select() // set Query for selecting user ID after validating UserName and Password
        .from("[dbo].[Drinks]")
        .where("DrinkName ='" + porductName + "'")
        .toString();
    return GetInformationOnProductByNameQuery;

}
exports.GetInformationOnProductByIDQuery=function (porductID) {
    let GetInformationOnProductByIDQuery = squel.select() // set Query for selecting user ID after validating UserName and Password
        .from("[dbo].[Drinks]")
        .where("DrinkID ='" + porductID + "'")
        .toString();
    return GetInformationOnProductByIDQuery;

}
exports.GetPastOrdersQuary =function (clientID) {
    let GetPastOrdersQuary = squel.select()
        .from("[dbo].[Orders]")
        .where("clientId ='"+clientID+"'")
        .toString();
    return GetPastOrdersQuary ;

}
exports.checkIfInStockQuary =function (itemID) {
    let checkIfInStockQuary = squel.select().field("StockAmount" )
        .from("[dbo].[Drinks]")
        .where("DrinkID ='"+itemID+"'")
        .toString();
    return checkIfInStockQuary ;

}
exports.purchaseProductQuary=function(ProductID ,quantity, clientID, date ,Currency){

    let query = squel.insert()  // set Query for Client Insert
        .into("[dbo].[Orders]")
        .set("ClientId", clientID)
        .set("DrinkId",ProductID)
        .set("Quantity", quantity)
        .set("PurchaseDate",date)
        .set("Currency", Currency)
        .toString();

    return query;
}
exports.MakeOrderCheckStokQuery=function (ListOfProducts, ListOfQuantity) {
    let MakeOrderCheckStokQuery = squel.select().field("StockAmount" )
        .from("[dbo].[Drinks]")
        .where('DrinkID IN ('+ListOfProducts.join()+')')
        .toString();
    return MakeOrderCheckStokQuery ;
}