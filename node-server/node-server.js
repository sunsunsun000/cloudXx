/**
 * 根据用户请求操作数据库并返回数据
 * @type {[type]}
 */
var http = require('http');
var path = require('path');
var app = http.createServer();
var fs = require('fs');
var url = require('url');

var mongo=require("mongodb");
var ObjectID = require("mongodb").ObjectID;
var host="localhost";
var port=27017;//mongo.Connection.DEFAULT_PORT;
var server=new mongo.Server(host,port,{auto_reconnect:true});//创建数据库所在的服务器服务器
var db=new mongo.Db("node-mongo-examples2",server,{safe:true});//创建数据库对象

var getData = function(db, filter, success) {
    db.collection("users", function (err,collection) {
        if(err) throw err;
        else{

            console.log(filter,'111111111111');
            collection.find(filter).toArray(function(err,docs){
                if(err) throw  err;
                else{
                    db.close();
                    success(docs);
                }
            });
        }
    });
};
var deleteItem = function(db, deleteLists, finish, result) {

    // db.collection('users', function(err, collection) {
    //     if(err) throw err;
    //         else {
                
    //             collection.remove({_id: ObjectID('5712189a63c042b0274fe31c')}, function(err,result) {
    //                 if(err) throw err;
    //                 else {
    //                     console.log(result);
    //                     db.close();
    //                 }
                    

    //             })
    //         }
    //     })





    console.log(deleteLists,'XXXXXXXXXXXXXX');
    if(deleteLists.length > 0) {
        db.collection('users', function(err, collection) {
        if(err) throw err;
            else {
                var id = deleteLists.pop()['_id'];
                
                collection.remove({_id: ObjectID(id)}, function(err,result) {
                    if(err) throw err;
                    else {
                        if(deleteLists.length > 0) {
                            deleteItem(db, deleteLists, result);
                        } else {
                            db.close();
                            finish(result);
                        }
                    }
                    
                })
            }
        })
    }
    
}
var singleInsert = function(db, data, finish, param) {
    db.collection("users", function (err,collection) {
        // console.log(data,'-------------------------');
        if(err) throw err;
        else {
            console.log(data);
            collection.insert(data, function(err, docs) {
                if(err) {
                    console.log(err);
                } else {
                    db.close();
                    finish(param);
                }
            });
        }
        
    }); 
}


db.once("close", function (err,db) {//关闭数据库
    if(err) throw err;
    else console.log("成功关闭数据库.");
});




function parseParams (string) {
    var arr = string.split('&');
    var result = {};
    arr.forEach(function (item) {
        var tmpArr = item.split('=');
        result[tmpArr[0]] = tmpArr[1];
    });
    return result;
}


function handleIssueList (req, res) {
    function readData(type, cb) {
        fs.readFile(path.resolve(__dirname, type + '.json'), function (err,data) {
            if (err) {
                handleError(err, result);
            } else {
                cb(JSON.parse(data));
            }
        });
    }
    function writeData(type, data, cb) {
        fs.writeFile(path.resolve(__dirname, type +'.json'), JSON.stringify(data), function (err) {
            if (err) {
                handleError(err, result);
            } else {
                cb();
            }
        });
    }
    function finish(obj) {
        res.end(JSON.stringify(obj));
    }
    function handleError (err, result) {
        result.code = -1;
        result.errMsg = err.message;
        finish(result);
    }
    var parsed = url.parse(req.url);
    var params = parseParams((parsed.search || '').substr(1));
    var result = {
        code: 0,
        errMsg: undefined
    };
    var formData = '';

    switch (req.method.toUpperCase()) {
        case 'DELETE': {
            req.on('data', function (chunk) {
                if (req.headers['content-type'].toLowerCase() == 'application/x-www-form-urlencoded') {
                    formData = formData + chunk.toString();
                }
            });
            req.on('end', function () {
                var deleteLists = [];

                var params = formData;
                console.log(params);
                params = eval ("(" + params + ")");

                // for(var i  = 0, len = params.length; i < len; i++) {
                //     console.log(params[i]);
                // }
                
                db.open(function (err,db) {//连接数据库
                    if(err)
                        throw err;
                    else{
                        deleteItem(db, params, finish, result);
                    }
                });
                
                



                // if (params.id) {
                //     readData('issue', function (data) {
                //         var flag = false;
                //         var target;
                //         data.forEach(function (item, index) {
                //             if (item.id == params.id) {
                //                 flag = true;
                //                 target = index;
                //             }
                //         });
                //         if (flag) {
                //             data.splice(target, 1);
                //             writeData('issue', data, function () {
                //                 finish(result);
                //             });
                //         } else {
                //             handleError({message: 'can not find id '+ params.id}, result);
                //         }
                //     });
                // } else {
                //     handleError({message: 'no id provided'}, result);
                // }
            });
            break;
        }
        case 'POST': {
            req.on('data', function (chunk) {
                if (req.headers['content-type'].toLowerCase() == 'application/x-www-form-urlencoded') {
                    formData = formData + chunk.toString();
                }
            });
            req.on('end', function () {
                var params = parseParams(formData);
                console.log('执行了');

                db.open(function (err,db) {//连接数据库
                    if(err)
                        throw err;
                    else{
                        // console.log(formData);
                        console.log(result);
                        console.log(formData);
                        singleInsert(db, JSON.parse(formData), finish, result);
                    }
                });



                // readData('issue', function (data) {
                //     var length = data.length;
                //     params.id = data[length - 1] ? data[length - 1].id + 1 : 1;
                //     data.push(params);
                //     console.log(params);
                //     writeData('issue', data, function () {
                //         finish(result);
                //     });
                // });
            });
            break;
        }
        case 'PUT': {
            req.on('data', function (chunk) {
                if (req.headers['content-type'].toLowerCase() == 'application/x-www-form-urlencoded') {
                    formData = formData + chunk.toString();
                }
            });
            req.on('end', function () {
                var params = parseParams(formData);
                params.id = +params.id;
                if (params.id) {
                    readData('issue', function (data) {
                        var flag = false;
                        var target;
                        data.forEach(function (item, index) {
                            if (item.id == params.id) {
                                flag = true;
                                target = index;
                            }
                        });
                        if (flag) {
                            data[target] = params;
                            writeData('issue', data, function () {
                                finish(result);
                            });
                        } else {
                            handleError({message: 'can not find id '+ params.id}, result);
                        }
                    });
                } else {
                    handleError({message: 'no id provided'}, result);
                }
            });
            break;
        }
        case 'GET':
        default: {
            console.log(params,'---------------------');
            
            var data = {
                list: [],
                total: 0, 
                pageSize: +params.ps || 10, 
                pageNum: +params.pn || 1,
            };

            var filter = {};
            
            if(params.storeCode) {

                filter.storeCode = decodeURI(params.storeCode);
            }
            if(params.storeName) {
                filter.storeName = decodeURI(params.storeName);
            }
            if(params.storeAddress) {
                filter.storeAddress = decodeURI(params.storeAddress);
            }
            if(params.status) {
                filter.status = decodeURI(params.status);
            }


            db.open(function (err,db) {//连接数据库
                if(err)
                    throw err;
                else{
                    getData(db, filter, function(rs) {
                        data.total = rs.length;
                        data.data = rs.slice(data.pageSize * (data.pageNum - 1), data.pageSize * data.pageNum);
                        result.data = data;
                        finish(result);  
                    });
                }
            });
        }
    }
}
var index = 0;

function handleCommentList (req, res) {
    function readData(type, cb) {
        fs.readFile(path.resolve(__dirname, type + '.json'), function (err,data) {
            if (err) {
                handleError(err, result);
            } else {
                cb(JSON.parse(data));
            }
        });
    }
    function writeData(type, data, cb) {
        fs.writeFile(path.resolve(__dirname, type +'.json'), JSON.stringify(data), function (err) {
            if (err) {
                handleError(err, result);
            } else {
                cb();
            }
        });
    }
    function finish(obj) {
        res.end(JSON.stringify(obj));
    }
    function handleError (err, result) {
        result.code = -1;
        result.errMsg = err.message;
        finish(result);
    }
    var parsed = url.parse(req.url);
    var params = parseParams((parsed.search || '').substr(1));
    var result = {
        code: 0,
        errMsg: undefined
    };
    var formData = '';
    switch (req.method.toUpperCase()) {
        case 'DELETE': {
            req.on('data', function (chunk) {
                if (req.headers['content-type'].toLowerCase() == 'application/x-www-form-urlencoded') {
                    formData = formData + chunk.toString();
                }
            });
            req.on('end', function () {
                var params = parseParams(formData);
                if (params.id) {
                    readData('comment', function (data) {
                        var flag = false;
                        var target;
                        data.forEach(function (item, index) {
                            if (item.id == params.id) {
                                flag = true;
                                target = index;
                            }
                        });
                        if (flag) {
                            data.splice(target, 1);
                            writeData('comment', data, function () {
                                finish(result);
                            });
                        } else {
                            handleError({message: 'can not find id '+ params.id}, result);
                        }
                    });
                } else {
                    handleError({message: 'no id provided'}, result);
                }
            });
            break;
        }
        case 'POST': {
            req.on('data', function (chunk) {
                if (req.headers['content-type'].toLowerCase() == 'application/x-www-form-urlencoded') {
                    formData = formData + chunk.toString();
                }
            });
            req.on('end', function () {
                var params = parseParams(formData);
                params.issueId = +params.issueId;
                if (!params.issueId) {
                    handleError({message: 'no issue id provided'}, result);
                } else {
                    readData('issue', function (data) {
                        var flag = false;
                        data.forEach(function (item) {
                            if (item.id == params.issueId) {
                                flag = true;
                            }
                        });
                        if (!flag) {
                            handleError({message: 'can not find issue by id '+ params.issueId}, result);
                            return;
                        }
                        readData('comment', function (data) {
                            var length = data.length;
                            params.id = data[length - 1] ? data[length - 1].id + 1 : 1;
                            data.push(params);
                            writeData('comment', data, function () {
                                finish(result);
                            });
                        });
                    });
                }
            });
            break;
        }
        case 'PUT': {
            req.on('data', function (chunk) {
                if (req.headers['content-type'].toLowerCase() == 'application/x-www-form-urlencoded') {
                    formData = formData + chunk.toString();
                }
            });
            req.on('end', function () {
                var params = parseParams(formData);
                params.id = +params.id;
                if (params.id) {
                    readData('comment', function (data) {
                        var flag = false;
                        var target;
                        data.forEach(function (item, index) {
                            if (item.id == params.id) {
                                flag = true;
                                target = index;
                            }
                        });
                        if (flag) {
                            data[target] = params;
                            writeData('comment', data, function () {
                                finish(result);
                            });
                        } else {
                            handleError({message: 'can not find id '+ params.id}, result);
                        }
                    });
                } else {
                    handleError({message: 'no id provided'}, result);
                }
            });
            break;
        }
        case 'GET':
        default: {
            var data = {
                list: [],
                total: 0, 
                pageSize: +params.pageSize || 10, 
                pageNum: +params.pageNum || 1
            };
            params.issueId = +params.issueId;
            if (params.issueId) {
                fs.readFile(path.resolve(__dirname, 'comment.json'), function (err, d) {
                    if (err) {
                        if (err.code === 'ENOENT') {
                            fs.writeFile(path.resolve(__dirname, 'comment.json'), '[]', function (err) {
                                if (err) {
                                    handleError(err, result);
                                    return;
                                }
                                result.data = data;
                                finish(result);
                            });
                        } else {
                            handleError(err, result);
                        }
                    } else {
                        var parsedData = JSON.parse(d);
                        parsedData = parsedData.filter(function (item) {
                            return item.issueId == params.issueId;
                        });
                        data.data = parsedData.slice(data.pageSize * (data.pageNum - 1), data.pageSize * data.pageNum);
                        data.total = parsedData.length;
                        result.data = data;
                        finish(result);
                    }
                });
            } else {
                handleError({message: 'no issueId provided'}, result);
            }
        }
    }
}

app.on('request', function (req, res) {

    var requestUrl = url.parse(req.url).pathname;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.setHeader("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");


    switch (requestUrl) {
        case '/get-data': {
            handleIssueList(req, res);
            break;
        }
        case '/comment': {
            handleCommentList(req, res);
            break;
        }
        default: {
            res.end(JSON.stringify({data: 'ok'}));
        }
    }
});

app.listen(7999);
console.log('server is staring at port 7999');