/**
 * 根据用户请求操作数据库并返回数据
 * @type {[type]}
 */
var http = require('http');
var path = require('path');
var fs = require('fs');
var url = require('url');
var nodemailer  = require("nodemailer");
var dbHelper = require('./dbHelper');

var app = http.createServer();

var user = '2509344578@qq.com', 
    pass = 'gwwokssvfnjtebhh';

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
    delete params.timeStamp;
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

                console.log(formData);
                params = eval ("(" + params + ")");
                console.log(params);
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
                formData = JSON.parse(formData || '{}');
                

                if(formData.loginRequest) {

                    dbHelper.getData('user2', {tooken:formData.tooken}, function(rs) {

                        if(rs.length <= 0) {

                            result.isLogin = false;
                            finish(result);
                        } else {
                            result.isLogin = true;
                            result.data = rs;
                            finish(result);
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
                            result.tooken = new Date().getTime() + '';

                            dbHelper.update('user2', {_id:rs[0]._id, name: formData.name,pwd:formData.pwd, tooken:result.tooken});
                            finish(result);
                        }
                    });

                } else if(formData.signOut) {

                    dbHelper.update('user2', {_id:formData._id, tooken: +formData.tooken}, finish, result);
                } else if(!!formData.isRegister) {//用户注册
                    console.log('用户注册');
                    delete formData.isRegister;
                    dbHelper.singleInsert('user2', formData, finish, result);
                } else {

                    console.log(formData,'8888888888888888888888888888');
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
                console.log(JSON.parse(formData));
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

            delete params.pl;
            delete params.ps;
            delete params.pn;

            // var filter = {};

            // console.log(params);
            
            // if(params.storeCode) {

            //     filter.storeCode = decodeURI(params.storeCode);
            // }
            // if(params.storeName) {
            //     filter.storeName = decodeURI(params.storeName);
            // }
            // if(params.storeAddress) {
            //     filter.storeAddress = decodeURI(params.storeAddress);
            // }
            // if(params.status) {
            //     filter.status = decodeURI(params.status);
            // }
            
            for(var index in params) {
                params[index] = decodeURI(params[index]);
            }
            console.log(params,'0000000000000000000000000000');
            if(!!params.judgeExit) {

                delete params.judgeExit;

                dbHelper.getData('user2', params, function(rs) {

                    data.total = rs.length;
                    data.data = rs.slice(data.pageSize * (data.pageNum - 1), data.pageSize * data.pageNum);
                    result.data = data;
                    finish(result);  
                });
            } else if(!!params.forgetPassword) {

                delete params.forgetPassword;
                dbHelper.getData('user2', params, function(rs) {
                    if(rs.length <= 0) {
                        result.data = {
                            message: '未找到用户'
                        }
                    } else {
                        result.data = {
                            message: '找回密码邮件已发送到您邮箱，请查收'
                        }

                        var smtpTransport = nodemailer.createTransport({
                              service: "QQ",
                              auth: {
                                user: user,
                                pass: pass
                            }
                          });

                        smtpTransport.sendMail({
                            from    : 'Service<' + user + '>'
                          , to      : '<' + user + '>'
                          , subject : '找回密码邮件'
                          , html    : '您的密码是：' + rs[0].pwd + ' <br> '
                        }, function(err, res) {
                            console.log(err, res);
                        });
                    }
                    
                    finish(result); 
                });
            }
            else {
                dbHelper.getData('users', params, function(rs) {

                    console.log(params);

                    data.total = rs.length;
                    data.data = rs.slice(data.pageSize * (data.pageNum - 1), data.pageSize * data.pageNum);
                    result.data = data;
                    finish(result);  
                });
            }
            
        }
    }
}

function mailIdentify (req, res) {

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
        case '/mail-identify': {
            mailIdentify(req, res);
            break;
        }
        default: {
            res.end(JSON.stringify({data: 'ok'}));
        }
    }
});

app.listen(7999);
console.log('server is staring at port 7999');