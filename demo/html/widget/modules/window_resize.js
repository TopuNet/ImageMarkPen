/*
	高京
	2016-07-11
	监听窗口大小改变模块
    callback: 回调方法
    依赖jquery@1.x 或 zepto
*/

define(["lib/jquery.min"], function() {

    return function(callback) {

        var resize_index = 0;
        $(window).resize(function() {
            if (resize_index++ > 0)
                return;
            setTimeout(function() {
                if (callback)
                    callback();
                resize_index = 0;
            }, 0);

        });
    };
});
