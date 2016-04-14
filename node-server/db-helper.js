/**
 * 对数据库的一些操作函数
 */
var data = [
		{
			"id": 100,
			"index": 1,
			"isSelected": false,
			"storeCode": 1000,
			"storeName": "店铺1",
			"storeAddress": "地址1",
			"createTime": "2016-4-11",
			"creater": "Xx",
			"status": "Y"
		},
		{
			"id": 101,
			"index": 2,
			"isSelected": true,
			"storeCode": 1000,
			"storeName": "店铺1",
			"storeAddress": "地址1",
			"createTime": "2016-4-11",
			"creater": "Xx",
			"status": "Y"
		},
		{
			"id": 102,
			"index": 3,
			"isSelected": false,
			"storeCode": 1000,
			"storeName": "店铺1",
			"storeAddress": "地址1",
			"createTime": "2016-4-11",
			"creater": "Xx",
			"status": "Y"
		},
		{
			"id": 102,
			"index": 3,
			"isSelected": false,
			"storeCode": 1000,
			"storeName": "店铺1",
			"storeAddress": "地址1",
			"createTime": "2016-4-11",
			"creater": "Xx",
			"status": "Y"
		},
		{
			"id": 102,
			"index": 3,
			"isSelected": false,
			"storeCode": 1000,
			"storeName": "店铺1",
			"storeAddress": "地址1",
			"createTime": "2016-4-11",
			"creater": "Xx",
			"status": "Y"
		},
		{
			"id": 102,
			"index": 3,
			"isSelected": false,
			"storeCode": 1000,
			"storeName": "店铺1",
			"storeAddress": "地址1",
			"createTime": "2016-4-11",
			"creater": "Xx",
			"status": "Y"
		},
		{
			"id": 102,
			"index": 3,
			"isSelected": false,
			"storeCode": 1000,
			"storeName": "店铺1",
			"storeAddress": "地址1",
			"createTime": "2016-4-11",
			"creater": "Xx",
			"status": "Y"
		},
		{
			"id": 102,
			"index": 3,
			"isSelected": false,
			"storeCode": 1000,
			"storeName": "店铺1",
			"storeAddress": "地址1",
			"createTime": "2016-4-11",
			"creater": "Xx",
			"status": "Y"
		},
		{
			"id": 102,
			"index": 3,
			"isSelected": false,
			"storeCode": 1000,
			"storeName": "店铺1",
			"storeAddress": "地址1",
			"createTime": "2016-4-11",
			"creater": "Xx",
			"status": "Y"
		}
	];

var mongo=require("mongodb");
var host="localhost";
var port=27017;//mongo.Connection.DEFAULT_PORT;
var server=new mongo.Server(host,port,{auto_reconnect:true});//创建数据库所在的服务器服务器
var db=new mongo.Db("node-mongo-examples2",server,{safe:true});//创建数据库对象
db.open(function (err,db) {//连接数据库
    if(err)
        throw err;
    else{
        getData(db);  
        // insert(db); 
        // multInsert(db, data);   
    }
});

var getData = function(db) {
    db.collection("users", function (err,collection) {
        if(err) throw err;
        else{
            collection.find({}).toArray(function(err,docs){
                if(err) throw  err;
                else{
                    console.log(docs);
                    db.close();
                }
            });
        }
    });
};

var multInsert = function(db, data) {

    db.collection("users", function (err,collection) {

    	for(var i = 0, len = data.length; i < len; i++) {
			collection.insert(data[i], function(err, docs) {
				if(err) console.log(err);
			});
		}
		// db.close();

            // collection.insert({username:"盼盼10",firstname:"李"}, function (err,docs) {
            //     console.log(docs);
            //     db.close();
            // });
        }); 
};


db.on("close", function (err,db) {//关闭数据库
    if(err) throw err;
    else console.log("成功关闭数据库.");
});