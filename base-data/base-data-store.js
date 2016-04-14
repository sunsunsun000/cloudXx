
app.controller('baseDataStoreCtrl', function($scope, request) {

	/**
	 * currentStatus----状态按钮被选择的状态，默认为空，即未选择任何状态
	 * statusList-------状态列表
	 * isSelected-------判断批量选择按钮是否被选中
	 */
	$scope.currentStatus = '';
	$scope.statusList = ['所有','正常','停用'];
	$scope.isSelectedAll = false;


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
		console.log($scope.currentStatus);
	};

	/**
	 * 重置按钮事件处理函数，将搜索条件框中的条件清空
	 */
	$scope.reset = function() {
		$scope.storeCode = '';
		$scope.storeName = '';
		$scope.storeAddress = '';
		$scope.currentStatus = '';
	};

	$scope.delete = function() {
		var deleteLists = [];
		angular.forEach($scope.lists, function(item) {
			if(item.isSelected) {
				deleteLists.push(item.id);
			}
		});
		//todo---------------------发送待删除数据的id到后台
	};

	/**
	 * 新建按钮响应函数
	 */
	$scope.add = function() {
		$('.cover').show();
	}

	/**
	 * 在新建数据弹出层点击取消按钮时事件响应函数
	 * @return {[type]} [description]
	 */
	$scope.cancel = function() {
		$('.cover').hide();
	}

	/**
	 * 在新建数据弹出层点击取消保存时事件响应函数
	 * @return {[type]} [description]
	 */
	$scope.save = function() {
		
	}

	/**
	 * 配置分页信息，触发回调函数被调用
	 * @type {Object}
	 */
	$scope.pageSearchList = {
        pn: 1,//当前显示的是第几页
        ps: 1,//每页显示多少条
        pl: 5,//分页栏显示页数
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
			params: {
				pageNum: args.pn,//$scope.pageSearchList.pn,
            	pageSize: args.ps//$scope.pageSearchList.ps,
			}
        };

        request(param).then(function(rs) {
			// console.log('chenggongle ');

			if (rs.data) {
                pn = $scope.pageSearchList.pn;
                console.log(rs.data.total);
                rs.pa = {
                    total: rs.data.total,//rs.data.params.total,
                    pn: $scope.pageSearchList.pn,//当前显示的是第几页
                    ps: $scope.pageSearchList.ps //每页显示多少条
                };
                console.log('-------------------------');
                console.log(rs);
                success(rs);
                $scope.lists = rs.data.data;

                // success(rs);
                // $scope.lists = rs.data;
            }
			

		}, function(err)  {
			console.log(err);
		});
    };

	
});