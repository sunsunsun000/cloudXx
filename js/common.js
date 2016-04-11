$(function() {
	// $('.item').bind('mouseover', function() {
	// 	$(this).find('.sub_container,sub_container_wrap').slideDown(200);
	// });
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
});

var app = angular.module('myApp', []);