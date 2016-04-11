
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
	 * 模拟请求回来的数据
	 */
	$scope.lists = [
		{
			id: 100,
			index: 1,
			isSelected: false,
			storeCode: 1000,
			storeName: '店铺1',
			storeAddress: '地址1',
			createTime: '2016-4-11',
			creater: 'Xx',
			status: 'Y'
		},
		{
			id: 101,
			index: 2,
			isSelected: false,
			storeCode: 1001,
			storeName: '店铺1',
			storeAddress: '地址1',
			createTime: '2016-4-11',
			creater: 'Xx',
			status: 'Y'
		},
		{
			id: 102,
			index: 3,
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
		var deleteLists = [];
		angular.forEach($scope.lists, function(item) {
			if(item.isSelected) {
				deleteLists.push(item.id);
			}
		});
		var query = {
			method: 'GET',
			lists: deleteLists,
			url: '../temp.json'
		};
		request(query).then(function(data) {
			console.log('chenggongle ');
		}, function(err)  {
			console.log(err);
		});




		// $http({
		//   method:'GET',
		//   url:'../temp.json'
		// }).then(function(data) {
		// 	// data为返回的数据对象
		// 	console.log('请求成功');
		// }, function(err) {
		// 	// err为请求失败后返回的错误信息
		// 	console.log('请求失败');
		// }).then(function() {
		// 	console.log('好吃呢拱了');
		// }, function(err) {
		// 	console.log(err);
		// });

		// $http({
		//   method:'GET',
		//   url:'../temp.json'
		// }).then(function(data) {
		// 	var defer = $q.defer();
		// 	console.log('chneggongle');
		// 	var a = true
		// 	if(!a){
  //               defer.reject({
  //                   type: -1,
  //                   data: data
  //               });
  //           }else {
  //               defer.resolve(data.data);
  //           }
  //           return defer.promise;
		// }, function (err) {
  //           throw {
  //               type: -1,
  //               data: err
  //           };
  //       }).then(function(data) {
		// 	console.log(123);
		// }, function(err) {
		// 	console.log(err);
		// });
		// .then(function() {
		// 	console.log('好吃呢拱了');
		// }, function(err) {
		// 	console.log(err);
		// });
	};

	$scope.click = function() {
		$('.inp').each(function(index, elem) {
			console.log(elem,elem.checked);
		});
	};
	
});