
app.controller('baseDataStoreCtrl', function($scope,$rootScope) {

	/**
	 * currentStatus----状态按钮被选择的状态，默认为空，即未选择任何状态
	 * statusList-------状态列表
	 * isSelected-------判断批量选择按钮是否被选中
	 */
	$scope.currentStatus = '';
	$scope.statusList = ['所有','正常','停用'];
	$scope.isSelectedAll = false;



	/**
	 * 模拟请求回来的数据
	 */
	$scope.lists = [
		{
			id: 1,
			isSelected: false,
			storeCode: 1000,
			storeName: '店铺1',
			storeAddress: '地址1',
			createTime: '2016-4-11',
			creater: 'Xx',
			status: 'Y'
		},
		{
			id: 2,
			isSelected: false,
			storeCode: 1001,
			storeName: '店铺1',
			storeAddress: '地址1',
			createTime: '2016-4-11',
			creater: 'Xx',
			status: 'Y'
		},
		{
			id: 3,
			isSelected: true,
			storeCode: 1002,
			storeName: '店铺1',
			storeAddress: '地址1',
			createTime: '2016-4-11',
			creater: 'Xx',
			status: 'N'
		}
	];

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
		$('.data_item').each(function(index, item) {
			console.log(item.checked);
		});
	};

	$scope.click = function() {
		$('.inp').each(function(index, elem) {
			console.log(elem,elem.checked);
		});
	};
	
});