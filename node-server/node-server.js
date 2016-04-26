/**
 * 根据用户请求操作数据库并返回数据
 * @type {[type]}
 */
var http = require('http');
var path = require('path');
var fs = require('fs');
var url = require('url');
var dbHelper = require('./dbHelper');

var app = http.createServer();

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

                params = eval ("(" + params + ")");
                
                dbHelper.deleteItem('users', params, finish, result);
                
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

                formData = JSON.parse(formData);

                if(formData.loginRequest) {

                    dbHelper.getData('user2', {tooken:formData.tooken}, function(rs) {

                        if(rs.length <= 0) {

                            result.isLogin = false;
                            finish(result);
                        } else {
                            param.isLogin = true;
                            finish(param);
                        }
                    });
                } else if(formData.islogin) {
                    //判断用户的登录信息是否正确
                    dbHelper.getData('user2', {name: formData.name,pwd:formData.pwd}, function(rs) {
                        if(rs.length <= 0) {

                            result.isLogin = false;
                            finish(result);

                        } else {
                            result.isLogin = true;
                            result.tooken = new Date().getTime();

                            dbHelper.update('user2', {_id:rs[0]._id, name: formData.name,pwd:formData.pwd, tooken:result.tooken});
                            finish(result);
                        }
                    });

                } else if(formData.signOut) {

                    dbHelper.update('user2', {_id:formData._id, tooken: +formData.tooken}, finish, result);
                } else {
                    console.log('插入数据');
                    console.log(formData);
                    dbHelper.singleInsert('users', formData, finish, result);
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
                console.log('更新数据');
                console.log(formData);
                dbHelper.update('users', JSON.parse(formData), finish, result);
            });
            break;
        }
        case 'GET':
        default: {

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

            dbHelper.getData('users', filter, function(rs) {
                data.total = rs.length;
                data.data = rs.slice(data.pageSize * (data.pageNum - 1), data.pageSize * data.pageNum);
                result.data = data;
                finish(result);  
            });
        }
    }
}
var index = 0;

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