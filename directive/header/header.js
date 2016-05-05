app.directive('header', function(request, $rootScope) {
	return {
		templateUrl: 'directive/header/header.html',
		restrict: 'E',
		replace: true,
		scope:{},
		link: function($scope, $element, $attrs) {
			/**
			 * 用户注册密码与确认密码
			 */
			$scope.registerPassword = '';
			$scope.registerRepassword = '';

			/**
			 * 注册信息错误提示
			 */
			$scope.registerNameTip = '';
			$scope.repasswordTip = '';

			$scope.newPassword = '';
			$scope.reNewPassword = '';

			/**
			 * 用以判断注册信息是否符合
			 */
			$scope.isRight = false;

			$('.item').hover(function() {
				$(this).find('.sub_container').stop().slideDown(500);
			});

			$('.item').mouseleave(function() {
				$(this).find('.sub_container').stop().slideUp(200);
			});

			$('.item').hover(function() {
				$(this).find('.sub_container_group').stop().slideDown(500);
			});
			$('.item').mouseleave(function() {
				$(this).find('.sub_container_group').stop().slideUp(200);
			});

			/**
			 * @param  {点击菜单栏具体条目时构建对应的路径文字显示在位置导航栏，同时隐藏弹出子菜单}
			 */
			$('.item').click(function(e) {
				var target = $(e.srcElement || e.target);
				var firstPath = $(this).children('a').text().trim() + ' > ';
				var secondPath = '';
				var ThirdPath = target.text();
				var $tempNode = target.parents('.sub_lists_group');
				if($tempNode.length > 0) {
					secondPath = $tempNode.prev().text() + ' > ';
				}
				$('#path_tip span').text(firstPath + secondPath + ThirdPath);
				$(this).find('.sub_container,.sub_container_group').stop().slideUp(10);
			});

			/**
		     * 根据指定的cookie名返回对应的cookie值
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
		     */
		    var isLoad = function() {
		    	var tooken = getCookie('tooken');
		    	if(tooken == -1) {//本地未保存有此用户的登陆信息~即未登录~
				 	console.log('未登录');
				 	$('div.login').css('display','block');
				 } else {
				 	var param = {
						url:'http://' + ip + ':7999/get-data',
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
							$rootScope.userName = $scope.userName = rs.data[0].name;
							$rootScope.userID = $scope.userID = rs.data[0]._id;
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
		     */
		    $scope.login = function() {
		    	var loginInfo = {
		    		islogin: true,
		    		name: $scope.username,
		    		pwd: $scope.password
		    	};

		    	var param = {
		    		url:'http://' + ip +':7999/get-data',
		    		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		    		method: 'POST',
		    		data: loginInfo
		    	};

		    	request(param).then(function(rs) {
		    		console.log('请求成功');
		    		console.log(rs);
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
		     */
		    var delCookie = function (name){//为了删除指定名称的cookie，可以将其过期时间设定为一个过去的时间
			   var date = new Date();
			   date.setTime(date.getTime() - 10000);
			   document.cookie = name + "=a; expires=" + date.toGMTString();
			};

			/**
			 * 设置cookie
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
		     */
		    $scope.signOut = function() {
		    	var tooken = getCookie('tooken');
		    	var param = {
		    		url:'http://' + ip +':7999/get-data',
					headers: {'Content-Type': 'application/x-www-form-urlencoded'},
					method: 'POST',
					data: {
						tooken:tooken,
						signOut:true,
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

		    $scope.editCount = function() {
		    	$('div.edit_count').show();
		    }

		    $scope.submit = function() {
		    	if(!$scope.isRight) {
		    		return;
		    	}
		    	var args = {
		    		isRegister: true,
		    		name: $scope.registerName,
		    		pwd: $scope.registerPassword
		    	};
		    	console.log(args);
		    	var param = {
		    		url:'http://' + ip +':7999/get-data',
		    		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		    		method: 'POST',
					data: args
		    	};

		    	request(param).then(function(rs) {
		    		alert('注册成功，请登录！');
		    		$('div.register').css('display', 'none');
		    	}, function(err) {
		    		alert('注册失败！');
		    	});
		    }

		    $scope.changePassWord = function() {
		    	var param = {
		    		url: 'http://' + ip + ':7999/get-data',
		    		method: 'PUT',
		    		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		    		data: {
		    			name: $scope.userName,
			    		pwd: $scope.newPassword,
			    		_id: $scope.userID,
			    		collectionName: 'user2'
		    		}
		    	}
		    	request(param).then(function(rs) {
		    		alert('密码修改成功');
		    		$('div.edit_count').hide();
		    	}, function(err) {
		    		alert('密码修改失败');
		    		$('div.edit_count').hide();
		    	})

		    }

		    $scope.cancel = function() {
		    	$scope.newPassword = $scope.reNewPassword = '';
		    	$('div.edit_count').hide();
		    }

		    $scope.$watch('registerRepassword', function(newValue, oldValue) {
		    	if(newValue !== $scope.registerPassword) {
		    		$scope.repasswordTip = '*两次输入密码不对！';
		    		$scope.isRight = false;
		    	} else {
		    		$scope.repasswordTip = '';
		    		$scope.isRight = true;
		    	}
		    });

		    $scope.$watch('registerName', function(newValue, oldValue) {

		    	if(!newValue) {
		    		return;
		    	}
		    	
		  		var param = {
		            url:'http://' + ip +':7999/get-data',
					method: 'GET',
					params: {
						name: newValue,
						judgeExit: true
					}
		        };

		        request(param).then(function(rs) {
		        	console.log(rs);
					if (rs.data) {
		                if(rs.data.data.length != 0) {
		                	$scope.registerNameTip = "*用户名已注册";
		                	$scope.isRight = false;
		                } else {
		                	$scope.registerNameTip = "";
		                	$scope.isRight = true;
		                }

		            }
					
				}, function(err)  {
					console.log(err);
				});
		    });

		    $scope.$watch('newPassword', function(newValue, oldValue) {
		    	if(newValue === '') {
		    		$scope.newPassWordTip = '*新密码不允许为空！';
		    		$scope.isRight = false;
		    	} else {
		    		$scope.newPassWordTip = '';
		    		$scope.isRight = true;
		    	} 
		    	if(newValue === $scope.reNewPassword) {
		    		$scope.rePasswordTip = '';
		    		$scope.isRight = true;
		    	}
		    })
		    $scope.$watch('reNewPassword', function(newValue, oldValue) {
		    	if(newValue !== $scope.newPassword) {
		    		$scope.rePasswordTip = '*两次输入密码不同！';
		    		$scope.isRight = false;
		    	} else {
		    		$scope.rePasswordTip = '';
		    		$scope.isRight = true;
		    	}
		    });

		}
	}
});