app.controller('loginCtrl', function($scope, request) {
	// $scope.login = function() {
 //    	var loginInfo = {
 //    		islogin: true,
 //    		name:$scope.username,
 //    		pwd:$scope.password
 //    	};

 //    	var param = {
 //    		url:'http://localhost:7999/get-data',
 //    		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
 //    		method: 'POST',
 //    		data: loginInfo
 //    	};

 //    	request(param).then(function(rs) {
 //    		console.log('请求成功');
 //    		if(!!rs.isLogin) {
 //    			alert('登陆成功');
 //    			$scope.userName = $scope.username;
 //    			$('div.login').css('display','none');

 //    		} else{
 //    			alert('登陆失败');
 //    		}
 //    	}, function(err) {
 //    		console.log('请求失败');
 //    		console.log(err);
 //    	});

 //    }

    $scope.codeErroTip = '';
    $scope.code = '';
    $scope.inpuCcode = '';


    //产生验证码  
    $scope.createCode = function() {  
         $scope.code = "";   
         var codeLength = 4;//验证码的长度 

         var random = new Array(0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R',  
         'S','T','U','V','W','X','Y','Z');//随机数  
         for(var i = 0; i < codeLength; i++) {//循环操作  
            var index = Math.floor(Math.random()*36);//取得随机数的索引（0~35）  
            $scope.code += random[index];//根据索引取得随机数加到code上  
        }

    }  
    //校验验证码  
    $scope.validate = function() {
        $scope.inpuCcode = $scope.inpuCcode.toUpperCase(); //取得输入的验证码并转化为大写        
        if($scope.inpuCcode <= 0) { //若输入的验证码长度为0  
            $scope.codeErroTip = "*请输入验证码";
        }
        else if($scope.inpuCcode != $scope.code ) { //若输入的验证码与产生的验证码不一致时  
            $scope.codeErroTip = "*验证码错误";
            $scope.createCode();//刷新验证码  
            $scope.inpuCcode = '';
        }         
        else { //输入正确时  
            $scope.codeErroTip = "";

            var param = {
                url: 'http://localhost:7999/get-data',
                method: 'GET',
                params: {
                    forgetPassword: true,
                    name: $scope.username
                }
            }

            request(param).then(function(rs) {
                alert(rs.data.message);
            }, function(err) {
                alert('找回密码失败');
            });
        }             
    }
    $scope.createCode();

});