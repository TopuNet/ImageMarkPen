/*
    v1.1.2

    that = {
        opt : {
            box: 固定高度的外盒，overflow:hidden。无默认值
            scrollWrapper: 滚动的外盒对象，如$(ul)。无默认值
            scrollWrapper_child: 子元素对象集，如$(li)。无默认值
            arrowUp: 上箭头对象。无默认值
            arrowDown: 下箭头对象。无默认值
            duration: 滚屏速度(ms)，默认500
            callback: 成功回调
        },
        timeStamp_last_scroll, // 记录最后一次滚动时的e.timeStamp
        timeStamp_last_apply, // 记录最后一次请求的e.timeStamp
        _timeStamp_last_apply, // 计算用，临时变量
        box_height_px:  // 获取当前box高度
    }
*/


function MouseWheel_Roll() {
    return {
        scrolling: false, // 记录当前滚动状态
        Paused: false, // 暂停状态
        current: 0, // 记录当前滚动在第几个子元素
        init: function(opt) {

            var that = this;

            that.timeStamp_last_scroll = 0; // 记录最后一次滚动时的e.timeStamp
            that.timeStamp_last_apply = 0; // 记录最后一次请求的e.timeStamp

            var opt_default = {
                duration: 500
            };
            that.opt = $.extend(opt_default, opt);

            if (!that.opt.box || !that.opt.scrollWrapper || !that.opt.scrollWrapper_child)
                return;

            // 获取当前box高度
            that.box_height_px = that.opt.box.height();

            // 设置上箭头隐藏
            that.set_arrow_display.apply(that, ["up", "none"]);

            // 标记当前子盒
            // var write_now = function() {
            //     that.opt.scrollWrapper_child.removeClass("Roll_now");
            //     $(that.opt.scrollWrapper_child[current]).addClass("Roll_now");
            // };

            // 监听浏览器滚动
            that.MouseWheel_Lisenter.apply(that);

            // 监听resize
            that.window_resize.apply(that);
        },
        // 监听鼠标滚轮
        MouseWheel_Lisenter: function() {

            var that = this;

            var agent = navigator.userAgent,
                handler = function(e) {
                    that.MouseWheel_handler.apply(that, [e]);
                };

            if (/.*Firefox.*/.test(agent)) {
                document.addEventListener("DOMMouseScroll", handler);
            } else {
                document.onmousewheel = handler;
            }
        },
        // 鼠标滚轮处理
        MouseWheel_handler: function(ev) {
            var that = this;

            // 判断是否传了滚动盒
            if (!that.opt || !that.opt.scrollWrapper) {
                return;
            }

            ev = ev || window.event; // firefox
            var wheelDelta = ev.wheelDelta || (ev.detail * -1); // firefox.detail

            that._timeStamp_last_apply = that.timeStamp_last_apply;
            that.timeStamp_last_apply = ev.timeStamp;

            // 解决mac端一次滚轮多次调用的bug
            if (
                ev.timeStamp && // ie7、8没有timeStamp
                that.timeStamp_last_scroll > 0 && // 首次进入此方法
                ev.timeStamp - that._timeStamp_last_apply < 100 && // 据上一次进入此方法的时间差，ie会大于100
                ev.timeStamp - that.timeStamp_last_scroll < 1500 // 距离上一次成功执行滑屏的时间差，mac端会在大约1.5s内反复进入此方法，所以1.5s内的重复请求均终止
            )
                return;

            if (that.scrolling || that.Paused) // 如正在执行，则终止
                return;
            that.scrolling = true;

            // 成功通过上方验证，则更新最后一次成功执行的时间
            that.timeStamp_last_scroll = parseInt(ev.timeStamp);

            if (wheelDelta > 0) { // 鼠标向上滚动
                that.MouseWheel_up.apply(that);
            } else { // 鼠标向下滚动
                that.MouseWheel_down.apply(that);
            }

        },
        // 鼠标向上滚动
        MouseWheel_up: function() {

            // console.log("up");

            var that = this;

            // 如果当前是第一屏 终止
            if (that.current === 0) {
                that.scrolling = false;
                return;
            }

            // 滚动到距离
            var scrollTop_px = -1 * that.opt.box.height() * (that.current - 1),
                // 回调
                callback = function() {
                    that.current--;

                    // write_now();

                    if (that.opt.arrowUp && that.opt.arrowDown) {
                        // 第一屏的话去掉上箭头
                        if (that.current === 0)
                            that.set_arrow_display.apply(that, ["up", "none"]);

                        // 显示下箭头
                        that.set_arrow_display.apply(that, ["down", "block"]);
                    }
                };


            that.Roll.apply(that, [scrollTop_px, callback]);
        },
        // 鼠标向下滚动
        MouseWheel_down: function() {

            // console.log("down");

            var that = this;

            //如果多于current个数 终止
            if (that.current >= that.opt.scrollWrapper_child.length - 1) {
                that.scrolling = false;
                return;
            }

            // 滚动到距离
            var scrollTop_px = -1 * that.opt.box.height() * (that.current + 1),
                // 回调
                callback = function() {
                    that.current++;

                    // write_now();

                    if (that.opt.arrowUp && that.opt.arrowDown) {
                        // 最后一屏的话去掉下箭头
                        if (that.current === that.opt.scrollWrapper_child.length - 1)
                            that.set_arrow_display.apply(that, ["down", "none"]);

                        // 显示上箭头
                        that.set_arrow_display.apply(that, ["up", "block"]);
                    }
                };


            that.Roll.apply(that, [scrollTop_px, callback]);
        },
        // 滚屏方法
        // @$top 滚动到距离
        Roll: function($top, _callback) {

            var that = this;

            // 成功回调
            var callback = function() {

                // 还原滚动状态
                that.scrolling = false;

                if (_callback)
                    _callback();

                if (that.opt.callback)
                    that.opt.callback();
            };

            // 有transition style测试
            var hasTransition = that.opt.scrollWrapper[0].style.transition;

            if (hasTransition === undefined || hasTransition === null) {
                that.opt.scrollWrapper.animate({
                    "margin-top": $top + "px"
                }, that.opt.duration, function() {
                    callback();
                });
            } else {
                that.opt.scrollWrapper.css({
                    transition: "transform " + that.opt.duration / 1000 + "s"
                }).one("transitionend", function() {
                    callback();
                });
                that.opt.scrollWrapper.css({
                    transform: "translateY(" + $top + "px)"
                });
            }

        },
        // 设置上下箭头的display
        // @_arrow_obj: "up|down"
        // @display_style: "hidden|block|other任意样式"
        set_arrow_display: function(_arrow_obj, display_style) {
            var that = this;
            var arrow_obj;
            switch (_arrow_obj.toLowerCase()) {
                case "up":
                    arrow_obj = that.opt.arrowUp;
                    break;
                case "down":
                    arrow_obj = that.opt.arrowDown;
                    break;
                default:
                    break;
            }

            if (arrow_obj && arrow_obj.length && arrow_obj.length > 0)
                arrow_obj.css({
                    display: display_style
                });
        },
        // 暂停监听
        Pause: function() {
            var that = this;

            that.Paused = true;
        },
        // 重启监听
        reStart: function() {
            var that = this;

            that.Paused = false;
        },
        // 监听resize
        window_resize: function() {

            var that = this;

            var resize_n = 0;

            $(window).on("resize", function() {
                if (resize_n > 0)
                    return;
                resize_n++;

                setTimeout(function() {
                    var scrollTop_px = -1 * that.opt.box.height() * (that.current);
                    that.Roll.apply(that, [scrollTop_px, function() {}]);
                    resize_n = 0;
                }, 0);
            });
        }
    };
}

if (typeof define === "function" && define.amd) {
    define(function() {
        return MouseWheel_Roll;
    });
}
