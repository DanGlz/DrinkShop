/**
 * Created by Dan gleyzer on 30-May-17.
 */
var Promise = require('promise')
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
let squel = require("squel");
let server = require("./server.js");


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
              //  console.log('Select Completed With : '+ dbReq.rowCount + ' row(s) returned');
               // console.log(ans);
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
           // console.log(query);

            var dbReq = new Request(query, function (err, rowCount) {
            if (err) {
              reject(err);
            }
            dbReq.on('requestCompleted', function () {
                connection.close();
                console.log('Insert request Completed: '+ dbReq.rowCount + ' row(s) returned');
                resolve(dbReq.rowCount)
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
        .set("isADmin",body.isAdmin)
        .toString();

    return query;
}

// select ClientID from given user name and password
exports.ClientIDLoginQuery=function (UserName,Password) {
    let ClientIDQuery = squel.select().field("ClientID").field("isADmin") // set Query for selecting user ID after validating UserName and Password
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
    let SearchProductQuery = squel.select() // set Query for selecting user ID after validating UserName and Password
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
exports.purchaseProduct=function(ProductID ,quantity, clientID, date ,Currency){

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

exports.updateStockAmount = function (arrayOfProdacts ,arrayOfQuantityToUpdate) {
    let query="";

    for (var i = 0; i < arrayOfProdacts.length; i++) {
        query+= "UPDATE Drinks SET StockAmount="+arrayOfQuantityToUpdate[i]+" WHERE DrinkID = "+arrayOfProdacts[i]+";"
    }

    return query;
}


exports.TopFiveProductsQuery= function () {

    let TopFiveQuery= "SELECT * FROM [dbo].[Drinks]" +
        " Where DrinkId IN( SELECT TOP 6 DrinkId FROM [dbo].[Orders]" +
        " GROUP BY DrinkId " +
        "order by count (*)  desc)"
  // console.log(TopFiveQuery);
    return TopFiveQuery;

}

// recommendation to user based on favorite categories and top products
exports.RecommendedProductsQuery= function (userID) {


    let RecommendedProductsQuery= "SELECT * FROM [dbo].[Drinks]" +
        " Where DrinkId IN( SELECT TOP 5 DrinkId FROM [dbo].[Orders]" +
        " GROUP BY DrinkId " +
        "order by count (*)  desc)"+
        "AND CategoryName IN " +
        "(SELECT CategoryName FROM [dbo].[ClientCategory] Where ( ClientID ="+ userID+"))"

    return RecommendedProductsQuery;

}


exports.GetProductsFromLastMonth =function () {
    let d = new Date();
    d.setMonth(d.getMonth() - 1);
    let dateFormat = require('dateformat');
    let MinDate = dateFormat(d, "mm/dd/yy");
    let GetProductsByDateQuery = squel.select()
        .from("[dbo].[Drinks]")
        .where("Date >='"+MinDate+"'")
        .toString();
    return GetProductsByDateQuery ;
}


exports.GetStockDetails = function (){
    let checkIfInStockQuary = squel.select().field("DrinkName" ).field("StockAmount")
        .from("[dbo].[Drinks]")
        .toString();
    return checkIfInStockQuary ;

}
exports.AddProductQuery = function (req) {
    let query = squel.insert()  // set Query for Client Insert
        .into("[dbo].[Drinks]")
        .set("DrinkName", req.body.DrinkName)
        .set("CategoryName",req.body.CategoryName)
        .set("Type", req.body.Type)
        .set("Year",req.body.Year)
        .set("Country", req.body.Country)
        .set("ABV",req.body.ABV)
        .set("Description", req.body.Description)
        .set("Price",req.body.Price)
        .set("StockAmount", req.body.StockAmount)
        .toString();

    return query;

}

exports.DeleteProductQuery =function (productID) {
    let query = squel.delete()
        .from("[dbo].[Drinks]")
        .where("DrinkID ='" + productID + "'")
        .toString();
    return query;

}
exports.DeleteClientQuery =function (ClientID) {
    let query = squel.delete()
        .from("[dbo].[Clients]")
        .where("ClientID ='" + ClientID + "'")
        .toString();
    return query;

}
exports.changeProductInventoryQuery= function(DrinkId, newIInventory){
    let Query = squel.update().table("[dbo].[Drinks]")
        .set("StockAmount", newIInventory)
        .where("DrinkID ='" + DrinkId + "'").toString();
    return Query;
}
exports.GetOrdersDetailsQuary = function () {
    let GetOrdersDetailsQuary = squel.select()
        .from("[dbo].[Orders]")
        .toString();
    return GetOrdersDetailsQuary ;
}