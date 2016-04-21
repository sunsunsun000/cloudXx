app.controller('loginCtrl', function($scope, request) {
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
});