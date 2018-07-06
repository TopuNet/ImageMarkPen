/*
    高京
    2016-07-11
    监听 容器盒滚动→决定是否显示 返回顶部按钮；并监听 返回顶部按钮 点击事件 及 滚动回顶部
    opt: {
        button_selector: "body", // 按钮元素选择器，建议在样式表中默认设为隐藏。默认"body"
        panel_selector: "div.box", // 外盒元素选择器（根据此元素滚动距离决定按钮是否显示(当滚动距离大于等于窗口的1/3时显示)；点击按钮后此元素的scrollTop滚至0）。默认window
        durTime_ms: 200, // 点击按钮后，外盒scrollTop滚至0的时间，毫秒。默认200
        callback_success: function(){} // 滚动完成后的回调方法
    } 
    依赖jquery@1.x 或 zepto
*/

define(function() {

    return function(opt) {

        var opt_default = {
            button_selector: "body",
            panel_selector: window,
            durTime_ms: 200,
            callback_success: null
        };

        opt = $.extend(opt_default, opt);

        if (opt.panel_selector === "window")
            opt.panel_selector = window;

        var button_obj = $(opt.button_selector); // 按钮对象
        var panel_obj = $(opt.panel_selector); // panel对象
        var scrollTop_obj = opt.panel_selector == window ? $("body,html") : panel_obj; // 滚动对象

        // 盒滚动scrollTop方法，解决zepto的animate不支持scrollTop的问题
        var scrollTop = function(_opt) {
            var _opt_default = {
                toTop_px: 0
            };
            _opt = $.extend(_opt_default, _opt);

            var perTime = 20;

            var top_now_px = panel_obj.scrollTop();
            var top_per_px = (_opt.toTop_px - top_now_px) / opt.durTime_ms * perTime;

            var set_scrollTop = function() {
                panel_obj.scrollTop(panel_obj.scrollTop() + top_per_px);
                var stop_toTop_bool = top_per_px <= 0 && panel_obj.scrollTop() <= _opt.toTop_px;
                var stop_toDown_bool = top_per_px >= 0 && panel_obj.scrollTop() >= _opt.toTop_px;
                if (stop_toTop_bool || stop_toDown_bool) {
                    if (opt.callback_success)
                        opt.callback_success();
                    return;
                } else
                    setTimeout(function() {
                        set_scrollTop();
                    }, perTime);
            };

            set_scrollTop();
        };

        // 监听按钮的点击
        button_obj.on("touchstart mousedown", function(e) { //点击回到顶部
            e.preventDefault();

            var success_count = 0;
            scrollTop_obj.animate({ scrollTop: '0px' }, opt.durTime_ms, function() {
                if (++success_count > 1)
                    return;
                setTimeout(function() {
                    success_count = 0;
                    scrollTop({
                        obj_selector: opt.panel_selector
                    });
                }, 0);
            });
        });

        // 根据panel的scrollTop决定button是否显示
        var test_position = function() {

            var scrollTop = panel_obj.scrollTop(); //获取scroll的值

            if (scrollTop > $(window).height() / 3) { //设置当scroll大于窗口高度1/3时，显示回到顶部按钮
                button_obj.css('display', 'block');
            } else { //设置当scroll不大于0时，隐藏回到顶部按钮
                button_obj.css('display', 'none');
            }
        };

        test_position();

        // 监听panel的滚动
        panel_obj.scroll(function() {
            test_position();
        });
    };
});
