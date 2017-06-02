/**
 * Created by Dan gleyzer on 30-May-17.
 */
var Promise = require('promise')
var Request = require('tedious').Request;


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
