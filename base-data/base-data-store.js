app.controller('baseDataStoreCtrl', function($scope, request, $timeout, $rootScope) {

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

	//指定操作的数据库的collectionName
	var collectionName = 'users';

	$scope.isSelectedAll = false;

	function reloadPage (args) {
		args = args || {};
		
		var temp = {
            ps: args.ps || 10,
            pn: args.pn || 1,
            pl: args.pl || 5,//分页栏显示页数
            collectionName: collectionName
        };

		temp.switch = !$scope.pageSearchList.switch;
        angular.extend(temp, args.filter || {});
        $scope.pageSearchList = temp;
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
			if(item.isSelected) {
				deleteLists.push({'_id':item['_id']});
			}
		});

		var param = {
			url:'http://' + ip +':7999/get-data',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'DELETE',
			data: {
				deleteLists: deleteLists,
				collectionName: collectionName
			}
		};

		request(param).then(function() {
			reloadPage();

		},function(err) {
			console.log(err);
		});
		
		$scope.isSelectedAll = false;
	};

	/**
	 * 新建按钮响应函数
	 */
	$scope.add = function(tableId) {
		$('div.cover').show();

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
		$('div.cover').hide();
		$('div.register').css('display', 'none');
	}

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
		if($scope._id && $scope._id !== '') {

			datas._id = $scope._id;
			datas.collectionName = collectionName;

			var param = {
				url:'http://' + ip +':7999/get-data',
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

			var time = new Date();
			datas.creater = $rootScope.userName;
			datas.createTime = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate();
			datas.collectionName = collectionName;
			var param = {
				url:'http://' + ip +':7999/get-data',
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

	$scope.register = function() {
		$('div.register').css('display', 'block');
	}

	/**
	 * 配置分页信息，触发回调函数被调用
	 * @type {Object}
	 */
	$scope.pageSearchList = {
        pn: 1,//当前显示的是第几页
        ps: 10,//每页显示多少条
        pl: 5,//分页栏显示页数
        collectionName: collectionName,
        switch: true //用以在需要reload时做pageSearchList的修改~以便在pagination.js的指令中watch~从而调用getOrderList分页函数
    };

    /**
     * 分页组建回调函数
     * @param  {[type]} args    [description]
     * @param  {[type]} success [description]
     * @return {[type]}         [description]
     */
    $scope.getOrderList = function(args, success){

        var param = {
            url:'http://' + ip +':7999/get-data',
			method: 'GET',
			params: args
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