
app.controller('baseDataStoreCtrl', function($scope, request) {

	/**
	 * currentStatus----状态按钮被选择的状态，默认为空，即未选择任何状态
	 * statusList-------状态列表
	 * isSelected-------判断批量选择按钮是否被选中
	 */
	$scope.currentStatusFilter = '';
	$scope.statusList = ['所有','正常','停用'];
	$scope.statusMap = {
		'所有': '',
		'正常': 'Y',
		'停用': 'N'
	};
	$scope.isSelectedAll = false;

	function reloadPage (args) {
		args = args || {};
		
		var temp = {
            ps: args.ps || 10,
            pn: args.pn || 1,
            pl: args.pl || 5,//分页栏显示页数
        };

		temp.switch = !$scope.pageSearchList.switch;
        angular.extend(temp, args.filter || {});
        // console.log($scope.pageSearchList == temp);
        $scope.pageSearchList = temp;

        // $scope.pageSearchList = {
        //     ps: args.ps || 10,
        //     pn: args.pn || 1,
        //     pl: args.pl || 5,//分页栏显示页数
        // };
    }

    /**
     * 根据指定的cookie名返回对应的cookie值
     * @param  {[type]} cookieName [description]
     * @return {[type]}            [description]
     */
    var getCookie = function(cookieName) {
    	tookenIndex = document.cookie.indexOf("tooken");
    	if(tookenIndex == -1) {
    		return -1;
    	} else {
    		var cookies = document.cookie.split('; ');
    		for(var i = 0, len = cookies.length; i < len; i++) {
    			if(cookies[i].indexOf('tooken') >=0) {
    				return cookies[i].split('=')[1];
    			}
    		}
    		
    	}
    }

    /**
     * 判断用户当前是否是登录状态
     * @return {Boolean} [description]
     */
    var isLoad = function() {
    	var tooken = getCookie('tooken');
    	if(tooken == -1) {//本地为保存有此用户的登陆信息~即未登录~
		 	console.log('未登录');
		 	$('div.login').css('display','block');
		 } else {
		 	var param = {
				url:'http://localhost:7999/get-data',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				method: 'POST',
				data: {
					tooken:tooken,
					loginRequest:true
				}
			};

			request(param).then(function(rs) {
				console.log('请求成功');
				if(!!rs.isLogin) {
					console.log('tooken有效');
				} else {
					console.log('tooken失效');
					$('div.login').css('display','block');
				}

			},function(err) {
				console.log('请求失败');
				console.log(err);
			});
		 }
    }

    /**
     * 发送用户名和密码到后台
     * @return {[type]} [description]
     */
    $scope.login = function() {
    	var loginInfo = {
    		islogin: true,
    		name:$scope.username,
    		pwd:$scope.password
    	};

    	var param = {
    		url:'http://localhost:7999/get-data',
    		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    		method: 'POST',
    		data: loginInfo
    	};

    	request(param).then(function(rs) {
    		console.log('请求成功');
    		if(!!rs.isLogin) {
    			alert('登陆成功');
    			setCookie('tooken', rs.tooken);
    			// document.cookie = "tooken=" + rs.tooken;
    			$scope.userName = $scope.username;
    			$('div.login').css('display','none');

    		} else{
    			alert('登陆失败');
    		}
    	}, function(err) {
    		console.log('请求失败');
    		console.log(err);
    	});

    }

    isLoad();


    /**
     * 删除cookie
     * @param  {[type]} name [description]
     * @return {[type]}      [description]
     */
    var delCookie = function (name){//为了删除指定名称的cookie，可以将其过期时间设定为一个过去的时间
	   var date = new Date();
	   date.setTime(date.getTime() - 10000);
	   document.cookie = name + "=a; expires=" + date.toGMTString();
	};

	/**
	 * 设置cookie
	 * @param {[type]} name  [description]
	 * @param {[type]} value [description]
	 */
	var setCookie = function (name, value) {
	    var argv = arguments;
	    var argc = arguments.length;
	    var expires = (argc > 2) ? argv[2] : null;
	    var path = (argc > 3) ? argv[3] : '/';
	    var domain = (argc > 4) ? argv[4] : null;
	    var secure = (argc > 5) ? argv[5] : false;
	    document.cookie = name + "=" + escape(value) +
	       ((expires == null) ? "" : ("; expires=" + expires.toGMTString())) +
	       ((path == null) ? "" : ("; path=" + path)) +
	       ((domain == null) ? "" : ("; domain=" + domain)) +
	       ((secure == true) ? "; secure" : "");
	};

    /**
     * 退出登录
     * @return {[type]} [description]
     */
    $scope.signOut = function() {
    	var tooken = getCookie('tooken');
    	var param = {
    		url:'http://localhost:7999/get-data',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'POST',
			data: {
				tooken:tooken,
				signOut:true,
				_id:item['_id']
			}
		};

		request(param).then(function() {
			console.log('请求发送成功');
			delCookie('tooken');
			$('div.login').show();
		}, function(err) {
			console.log(err);
		});
    }


	/**
	 * 批量选中按钮事件处理函数
	 */
	$scope.selectAll = function() {
		$scope.isSelectedAll = !$scope.isSelectedAll;
		angular.forEach($scope.lists, function(item){
			item.isSelected = $scope.isSelectedAll;
		});
	};


	/**
	 * 搜索按钮事件处理函数
	 */
	$scope.search = function() {
		var filter = {};
		if($scope.storeCodeFilter) {
			filter['storeCode'] = $scope.storeCodeFilter;
		}
		
		if($scope.storeNameFilter) {
			filter['storeName'] = $scope.storeNameFilter;
		}
		if($scope.storeAddressFilter) {
			filter['storeAddress'] = $scope.storeAddressFilter;
		}
		if($scope.currentStatusFilter) {
			filter['status'] = $scope.statusMap[$scope.currentStatusFilter];
		}

		var param = {};
		param['filter'] = filter;
		reloadPage(param);

	};

	/**
	 * 重置按钮事件处理函数，将搜索条件框中的条件清空
	 */
	$scope.reset = function() {
		$scope.storeCodeFilter = '';
		$scope.storeNameFilter = '';
		$scope.storeAddressFilter = '';
		$scope.currentStatusFilter = '';
	};

	$scope.delete = function() {
		var deleteLists = [];
		angular.forEach($scope.lists, function(item) {
			console.log(item);
			if(item.isSelected) {
				deleteLists.push({'_id':item['_id']});
			}
		});

		var param = {
			url:'http://localhost:7999/get-data',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'DELETE',
			data: deleteLists
		};
		console.log('123123123123123');
		request(param).then(function() {
			console.log('请求成功');
			reloadPage();

		},function(err) {
			console.log('请求失败');
			console.log(err);
		});



		console.log(deleteLists);
		
		$scope.selectAll();
	};

	/**
	 * 新建按钮响应函数
	 */
	$scope.add = function(tableId) {
		$('.cover').show();

		var dataItems = $('#' + tableId).find('input');
		$scope.storeCode = "";
		$scope.storeName = "";
		$scope.storeAddress = "";
		$scope.phone = "";
		$(':radio').attr("checked",false);
	}

	/**
	 * 在新建数据弹出层点击取消按钮时事件响应函数
	 * @return {[type]} [description]
	 */
	$scope.cancel = function() {
		$('.cover').hide();
	}

	console.log($scope._id);

	/**
	 * 在新建数据弹出层点击取消保存时事件响应函数
	 * @return {[type]} [description]
	 */
	$scope.save = function(formName,tableId) {

		var datas = {};
		var dataItems = $('#' + tableId).find('input');
		for(var i = 0; i < dataItems.length; i++) {
			var temp = dataItems.eq(i);

			if(temp.attr('type') == 'radio') {
				if(temp[0].checked) {
					datas[temp.attr('name')] = temp.val();
				}
			} else {
				datas[temp.attr('name')] = temp.val();
			}
		}
		console.log($scope._id);
		if($scope._id && $scope._id !== '') {
			console.log('更新数据');
			datas._id = $scope._id;

			var param = {
				url:'http://localhost:7999/get-data',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				method: 'PUT',
				data: datas
			};
			
			request(param).then(function() {
				console.log('请求成功');
				$('.cover').hide();
				reloadPage();
				$scope._id = '';

			},function(err) {
				console.log(err);
				$('.cover').hide();
				$scope._id = '';
			});

		} else {
			console.log('插入数据');
			var param = {
				url:'http://localhost:7999/get-data',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				method: 'POST',
				data: datas
			};
			
			request(param).then(function() {
				console.log('请求成功');
				$('.cover').hide();
				reloadPage();
				$scope._id = '';

			},function(err) {
				console.log(err);
				$('.cover').hide();
				$scope._id = '';
			});
		}
		console.log(datas);

		
	}

	$scope.edit = function(index) {
		var item = $scope.lists[index];
		$scope.storeCode = item.storeCode;
		$scope.storeName = item.storeName;
		$scope.storeAddress = item.storeAddress;
		$scope.phone = item.phone;
		console.log(item.status);
		if(item.status == 'Y') {
			$('#normal').attr('checked', true)
		} else {
			$('#closed').attr('checked', true);
		}

		$('.cover').show();

		$scope._id = item._id
	}

	/**
	 * 配置分页信息，触发回调函数被调用
	 * @type {Object}
	 */
	$scope.pageSearchList = {
        pn: 1,//当前显示的是第几页
        ps: 10,//每页显示多少条
        pl: 5,//分页栏显示页数
        switch: true //用以在需要reload时做pageSearchList的修改~以便在pagination.js的指令中watch~从而调用getOrderList分页函数
    };

    /**
     * 分页组建回调函数
     * @param  {[type]} args    [description]
     * @param  {[type]} success [description]
     * @return {[type]}         [description]
     */
    $scope.getOrderList = function(args, success){
    	console.log(args);

        var param = {
            url:'http://localhost:7999/get-data',
			method: 'GET',
			params: args
			// params: {
			// 	pageNum: args.pn,//$scope.pageSearchList.pn,
   //          	pageSize: args.ps,//$scope.pageSearchList.ps,
			// }
        };

        request(param).then(function(rs) {

			if (rs.data) {
                pn = $scope.pageSearchList.pn;
                rs.pa = {
                    total: rs.data.total,//rs.data.params.total,
                    pn: $scope.pageSearchList.pn,//当前显示的是第几页
                    ps: $scope.pageSearchList.ps //每页显示多少条
                };
                success(rs);
                $scope.lists = rs.data.data;

            }
			
		}, function(err)  {
			console.log(err);
		});
    };
	
});