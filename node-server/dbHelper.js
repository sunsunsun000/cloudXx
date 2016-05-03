var mongo = require("mongodb");
var ObjectID = require("mongodb").ObjectID;

var host = "192.168.2.104";
var port = 27017; //mongo.Connection.DEFAULT_PORT;
var server = new mongo.Server(host, port, { auto_reconnect: true }); //创建数据库所在的服务器服务器
var db = new mongo.Db("node-mongo-examples2", server, { safe: true }); //创建数据库对象

db.open(function(err, db) {
    if (err) {
        throw err;
    }
});

var getData = function(collectionName, filter, success) {
    console.log(filter,'-------============---------------');
    db.collection(collectionName, function(err, collection) {
        if (err) {
            throw err;
        } else {
            collection.find(filter).toArray(function(err, docs) {
                if (err) {
                    throw err;
                } else {
                    success(docs);
                }
            });
        }
    });
};

var deleteItem = function(collectionName, deleteLists, finish, result) {

    if (deleteLists.length > 0) {
        db.collection(collectionName, function(err, collection) {
            if (err) {
                throw err;
            } else {

                var id = deleteLists.pop()['_id'];
                console.log(ObjectID(id),'-------------------');

                collection.remove({ _id: ObjectID(id) }, function(err, result) {
                    if (err) {

                        throw err;
                    } else {

                        if (deleteLists.length > 0) {
                            deleteItem(collectionName, deleteLists, finish, result);
                        } else {
                            finish(result);
                        }
                    }
                })
            }
        })
    }
};


var singleInsert = function(collectionName, data, finish, param) {

    db.collection(collectionName, function(err, collection) {
        if (err) {
            throw err;
        } else {
            collection.insert(data, function(err, docs) {

                if (err) {
                    console.log(err);
                } else {
                    finish(param);
                }
            });
        }
    });
};

var update = function(collectionName, data, finish, result) {

    db.collection(collectionName, function(err, collection) {
        if (err) {
            throw err;
        } else {
            var id = ObjectID(data._id);
            delete data._id;
            collection.update({ _id: id }, { $set: data }, { safe: true }, function(err, result) {
                if (err) {
                    console.log(err);
                } else {

                    if (finish) {
                        finish(result);
                    }
                }
            });
        }
    });
};

db.on("close", function(err, db) { //关闭数据库
    if (err) throw err;
    else console.log("成功关闭数据库.");
});

exports.getData = getData;
exports.deleteItem = deleteItem;
exports.singleInsert = singleInsert;
exports.update = update;
