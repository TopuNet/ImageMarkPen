// 2.4.1
function RotatingBanner() {
    return {
        Timeout_id: null, // 记录定时器ID，清除时用
        Rotating: false, // 记录当前是否在轮播
        pointer_count: null, // 屏数量
        pointer_now: 0, // 当前高亮圆点
        box_width_px: null, // 外盒宽度，后续程序中获得
        li_width_px: null, // li宽度（含margin），后续程序中获得
        autoPlay: null, // 最原始传参的autoPlay（移动端touchend重启轮播用）
        // 参数集
        paras: {
            effect: null, // 过渡效果。move-横向移动；fade-淡出。默认 "move"
            mobile_effect: null, // 移动端效果：touchstart暂停、touchend重启并判断touchmove-x距离决定是否左右滑屏1次。effect=move时有效。默认false
            mobile_effect_touchmove_distance_vw: null, // 采用移动端效果时，监听触摸滑屏的起效距离，单位vw，默认30
            autoPlay: null, // 自动播放：left/right/null，默认值：null。effect=move时，left和right效果一致
            box_selector: null, // 外盒选择器，默认值：section.banner
            pic_ul_selector: null, // 图片li的ul盒选择器，此盒必须存在于box_selector中，且值中不用包含box_selector。默认值：ul.pic_ul
            pic_li_selector: null, // 图片li的选择器，此盒必须存在于pic_ul_selector中，且值中不用包含pic_ul_selector。解决li中含有子li的问题。默认值: li
            point_ul_selector: null, // 圆点li的ul盒选择器，空字符串为无圆点。此盒不必存在于box_selector中。默认值：section.banner ul.point_ul。
            point_autoCreate: null, // 自动生成圆点，默认值：false
            point_li_selected_className: null, // 圆点高亮li的className，默认值：selected
            arrow_left_selector: null, // 左箭头的盒选择器，此盒不必存在于box_selector中。null为无左箭头。默认值：null
            arrow_right_selector: null, // 右箭头的盒选择器，此盒不必存在于box_selector中。null为无右箭头。默认值：null
            duration: null, // 动画过渡时间，毫秒。默认500
            resize_li: null, // 自动改变li的宽高为外盒的宽高，默认true
            distance: null, // 自动轮播和圆点点击时，滚动距离：distance个li；不为1时，只支持单行多列平铺的li。默认为1。
            delay: null, // 动画间隔，毫秒。默认5000
            move_callback: function(pointer_now) {} // 切屏后的回调 @pointer_now：当前第几屏，0为第一个
        },
        init: function(_paras) {

            var paras_default = {
                effect: "move",
                mobile_effect: false,
                mobile_effect_touchmove_distance_vw: 30,
                autoPlay: null,
                box_selector: "section.banner",
                pic_ul_selector: "ul.pic_ul",
                pic_li_selector: "li",
                point_ul_selector: "section.banner ul.point_ul",
                point_autoCreate: false,
                point_li_selected_className: "selected",
                arrow_left_selector: null,
                arrow_right_selector: null,
                duration: 500,
                resize_li: true,
                distance: 1,
                delay: 5000
            };
            this.paras = $.extend(paras_default, _paras);
            _paras = this.paras;
            this.autoPlay = _paras.autoPlay;

            if (_paras.effect == "fade")
                console.dir(_paras);

            if (this.paras.effect == "fade") {
                this.paras.mobile_effect = false;
                this.paras.distance = 1;
            }

            // 屏数量
            var pointer_count = $(_paras.box_selector + " " + _paras.pic_ul_selector + " " + _paras.pic_li_selector).length;
            this.pointer_count = parseInt(pointer_count / _paras.distance);
            if (pointer_count % _paras.distance !== 0)
                this.pointer_count++;

            // 创建圆点
            if (_paras.point_autoCreate) {
                var pointer_ul = $(_paras.point_ul_selector);
                var pointer_li = $(document.createElement("li"));
                var _i = 0;
                pointer_ul.html("");
                for (; _i < this.pointer_count; _i++) {
                    pointer_li.clone().appendTo(pointer_ul);
                }
            }

            // 监听重置窗口大小
            this.resize();

            if (this.pic_length > 1) {
                // 监听圆点
                if (_paras.point_ul_selector !== "")
                    this.PointListener();

                // 监听左箭头
                if (_paras.arrow_left_selector)
                    this.arrowLeftListener();

                // 监听右箭头
                if (_paras.arrow_right_selector)
                    this.arrowRightListener();

                // 轮播
                if (_paras.autoPlay)
                    this.preRotating(_paras.autoPlay.toLowerCase());

                // 移动端效果
                if (_paras.mobile_effect)
                    this.MobileEffectListen();
            }
        },

        // 监听重置窗口大小
        resize: function() {
            var n = 0; // 解决某些浏览器resize执行两遍的bug
            var this_obj = this;
            var _paras = this_obj.paras;
            var box_obj = $(_paras.box_selector); // 盒对象
            var pic_ul_obj = $(box_obj.find(_paras.pic_ul_selector)); // 图片ul对象
            var pic_li_obj = $(box_obj.find(_paras.pic_ul_selector + " " + _paras.pic_li_selector)); // 图片li对象

            this_obj.pic_length = pic_li_obj.length;

            $(window).resize(function() {
                if (++n % 2 === 0)
                    return;
                resize_do();
            });

            var resize_do = function() {

                var box_width_px = _paras.box_width_px = $.outerWidth ? box_obj.outerWidth() : box_obj.width();
                var box_height_px = _paras.box_height_px = $.outerHeight ? box_obj.outerHeight() : box_obj.height();

                setTimeout(function() {
                    if (_paras.resize_li) {


                        if (this_obj.pic_length < 1) // 没有li则不往下执行
                            return;
                        pic_li_obj.css("width", box_width_px + "px");
                        pic_li_obj.css("height", box_height_px + "px");
                    }

                    if (pic_li_obj.length === 0)
                        this_obj.li_width_px = 0;
                    else {
                        var _li_obj = $($(_paras.box_selector + " " + _paras.pic_ul_selector + " " + _paras.pic_li_selector)[0]);
                        this_obj.li_width_px = parseFloat(_li_obj.css("width").replace("px", "")) + parseFloat(_li_obj.css("margin-left").replace("px", "")) + parseFloat(_li_obj.css("margin-right").replace("px", ""));
                    }

                    var ul_width_px = this_obj.li_width_px;

                    if (_paras.effect == "move")
                        ul_width_px *= pic_li_obj.length;

                    pic_ul_obj.css("width", ul_width_px + "px");

                    n = 0;

                }, 0);

            };

            resize_do(this_obj);
        },

        // 轮播准备
        // direct：left/right
        preRotating: function(direct) {
            var this_obj = this;
            clearTimeout(this_obj.Timeout_id);

            // 渐进淡出
            if (this_obj.paras.effect == "fade") {
                this_obj.Timeout_id = setTimeout(function() {
                    if (this_obj.paras.autoPlay)
                        this_obj.fadeToNext();
                }, this_obj.paras.delay);
                return;
            }

            // 左右滑屏
            var switch_left_default = function() {
                this_obj.Timeout_id = setTimeout(function() {
                    if (this_obj.paras.autoPlay) {
                        this_obj.scrollToLeft();
                    }
                }, this_obj.paras.delay);
            };
            switch (direct.toLowerCase()) {
                case "left":
                    switch_left_default();
                    break;
                default:
                    switch_left_default();
                    break;
                case "right":
                    this_obj.Timeout_id = setTimeout(function() {
                        if (this_obj.paras.autoPlay)
                            this_obj.scrollToRight();
                    }, this_obj.paras.delay);
                    break;
            }
        },

        // 渐进淡出 X张
        fadeToNext: function(X) {
            var this_obj = this;
            if (this_obj.Rotating)
                return;
            this_obj.Rotating = true;
            var _paras = this_obj.paras;

            if (!X)
                X = this_obj.paras.distance;

            var ul_obj = $(_paras.box_selector + " " + _paras.pic_ul_selector);
            var li_obj = ul_obj.find(_paras.pic_li_selector);
            var li_length = li_obj.length;
            var li_obj_last = li_obj.last();

            if (X >= li_length)
                X = li_length - 1;

            if (X === 1) {
                li_obj = li_obj_last;
            } else {
                li_obj = ul_obj.find(_paras.pic_li_selector + ":gt(" + (li_length - X - 1) + ")");

                var i = 0;
                li_length = li_obj.length;

                for (; i < li_length - 1; i++)
                    $(li_obj[i]).css({
                        display: "none"
                    });
            }

            // console.log(li_obj.length);

            // 切换
            this_obj.setFadeTo.apply(this_obj, [li_obj, this_obj.paras.duration, function(_this_obj, _li_obj) {

                _li_obj.prependTo(ul_obj).css({
                    "opacity": "1",
                    "display": "block"
                });


                // 切换圆点
                _this_obj.pointer_now += X;
                if (_this_obj.pointer_now >= _this_obj.pointer_count) {
                    _this_obj.pointer_now -= _this_obj.pointer_count;
                }
                _this_obj.changePoint();

                _this_obj.Rotating = false;

                // 再次执行滚动（如autoPlay不为null）
                if (_this_obj.paras.autoPlay)
                    _this_obj.preRotating(_this_obj.paras.autoPlay.toLowerCase());

            }]);
        },

        // 向左滚X屏和Y个圆点位
        scrollToLeft: function(X, Y) {
            var this_obj = this;
            if (this_obj.Rotating)
                return;
            this_obj.Rotating = true;
            var _paras = this_obj.paras;

            if (!X)
                X = _paras.distance;
            if (!Y)
                Y = 1;

            var ul_obj = $(_paras.box_selector + " " + _paras.pic_ul_selector);

            // 计算滚动后的left值
            var ul_left_px_new = -X * this_obj.li_width_px;

            // 执行滚动
            this_obj.setTranslate.apply(this_obj, [ul_obj, _paras.duration, ul_left_px_new, function(_this_obj, ul_obj) {

                var li_obj = ul_obj.find(_paras.pic_li_selector);
                var i = 0;
                for (; i < X; i++) {
                    $(li_obj[i]).appendTo(ul_obj);
                }
                _this_obj.setTranslate.apply(_this_obj, [ul_obj, 0, 0]);

                // 切换pointer_now和pointer_now
                _this_obj.pointer_now += Y;
                if (_this_obj.pointer_now >= _this_obj.pointer_count) {
                    _this_obj.pointer_now = 0;
                }

                // 切换圆点
                _this_obj.changePoint();

                _this_obj.Rotating = false;

                // 再次执行滚动（如autoPlay不为null）
                if (_this_obj.paras.autoPlay)
                    _this_obj.preRotating(_this_obj.paras.autoPlay.toLowerCase());


            }]);
        },

        // 向右滚X屏和Y个圆点位
        scrollToRight: function(X, Y) {
            var this_obj = this;
            if (this_obj.Rotating)
                return;
            this_obj.Rotating = true;
            var _paras = this_obj.paras;

            if (!X)
                X = _paras.distance;
            if (!Y)
                Y = 1;

            var ul_obj = $(_paras.box_selector + " " + _paras.pic_ul_selector);

            var li_obj = $(ul_obj.find(_paras.pic_li_selector));
            var li_obj_len = li_obj.length;

            var i = 0;
            for (; i < X; i++)
                $(li_obj[li_obj_len - (i + 1)]).prependTo(ul_obj);

            this_obj.setTranslate.apply(this_obj, [ul_obj, 0, -X * this_obj.li_width_px]);

            setTimeout(function() {
                this_obj.setTranslate.apply(this_obj, [ul_obj, _paras.duration, 0, function(_this_obj) {

                    // 切换pointer_now
                    _this_obj.pointer_now -= Y;
                    if (_this_obj.pointer_now < 0) {
                        _this_obj.pointer_now = _this_obj.pointer_count - 1;
                    }

                    // 切换圆点
                    _this_obj.changePoint();

                    _this_obj.Rotating = false;

                    // 再次执行滚动（如autoPlay不为null）
                    if (_this_obj.paras.autoPlay)
                        _this_obj.preRotating(_this_obj.paras.autoPlay.toLowerCase());
                }]);
            }, 0);
        },

        // 切换圆点高亮
        changePoint: function() {
            var this_obj = this;
            var _paras = this_obj.paras;
            var obj = $(_paras.point_ul_selector + " li");
            obj.siblings("." + _paras.point_li_selected_className).removeClass(_paras.point_li_selected_className);
            $(obj[this_obj.pointer_now]).addClass(_paras.point_li_selected_className);
            if (_paras.move_callback)
                _paras.move_callback(this_obj.pointer_now);
        },

        // 监听圆点
        PointListener: function() {
            var this_obj = this;
            var _paras = this_obj.paras;
            var obj = $(_paras.point_ul_selector + " li");
            $(obj[0]).addClass(_paras.point_li_selected_className);
            obj.on("touchstart mousedown", function(event) {
                event.preventDefault();
                var n = $(this).index();
                if (n == this_obj.pointer_now)
                    return;

                // clearTimeout();

                if (_paras.effect == "move") {
                    if (n < this_obj.pointer_now)
                        this_obj.scrollToRight((this_obj.pointer_now - n) * _paras.distance, this_obj.pointer_now - n);
                    if (n > this_obj.pointer_now)
                        this_obj.scrollToLeft((n - this_obj.pointer_now) * _paras.distance, n - this_obj.pointer_now);
                } else if (_paras.effect == "fade") {
                    var X = n - this_obj.pointer_now;
                    if (X < 0)
                        X += obj.length;
                    this_obj.fadeToNext(X);
                }
            });
        },

        // 监听左箭头
        arrowLeftListener: function() {
            var this_obj = this;
            var _paras = this_obj.paras;
            $(_paras.arrow_left_selector).on("touchstart mousedown", function(event) {
                event.preventDefault();
                this_obj.scrollToRight();
            });
        },

        // 监听右箭头
        arrowRightListener: function() {
            var this_obj = this;
            var _paras = this_obj.paras;
            $(_paras.arrow_right_selector).on("touchstart mousedown", function(event) {
                event.preventDefault();
                this_obj.scrollToLeft();
            });
        },

        // 暂停自动播放
        Pause: function() {
            this.paras.autoPlay = null;
        },

        // 重启自动播放
        reStart: function(direction) {
            if (!this.paras.autoPlay) {
                this.paras.autoPlay = direction || "left";
                this.preRotating(this.paras.autoPlay);
            }
        },

        // 移动端效果监听
        MobileEffectListen: function() {
            var this_obj = this;
            var _paras = this_obj.paras;
            var pic_ul_obj = $(_paras.box_selector + " " + _paras.pic_ul_selector);
            var touchstart_x;
            var touchend_x;
            var window_width_px = $(window).width();

            // touchstart
            pic_ul_obj.on("touchstart", function(event) {
                touchstart_x = event.touches[0].clientX;
                touchend_x = null;
                this_obj.Pause();
            });

            // touchmove
            pic_ul_obj.on("touchmove", function(event) {
                touchend_x = event.touches[0].clientX;
            });

            // touchend
            pic_ul_obj.on("touchend", function() {
                if (!touchend_x)
                    return;

                var distance_vw = (touchend_x - touchstart_x) / window_width_px * 100;
                var duration = 0;

                // 验证横向位移是否超过阈值
                if (distance_vw >= _paras.mobile_effect_touchmove_distance_vw || distance_vw <= -_paras.mobile_effect_touchmove_distance_vw) {

                    duration = _paras.duration;

                    if (distance_vw < 0)
                        this_obj.scrollToLeft();
                    else {
                        this_obj.scrollToRight();
                    }
                }

                if (this_obj.autoPlay)
                    setTimeout(function() {
                        this_obj.reStart(this_obj.autoPlay);
                    }, duration);

            });
        },

        // 设置translate-x样式
        // obj: 设置对象
        // duration: 动画时间，毫秒数
        // x: translate-x值
        // callback: 完成回调
        setTranslate: function(obj, duration, x, callback) {
            var this_obj = this;

            // 判断
            var transition = obj[0].style.transition;
            if (transition === undefined || transition === null) {

                obj.animate({
                    left: x + "px"
                }, duration, function() {
                    if (callback)
                        callback(this_obj, obj);
                });

            } else {

                obj.css({
                    "transition": "all " + duration * 0.001 + "s linear",
                    "transform": "translateX(" + x + "px)",
                    "-webkit-transform": "translateX(" + x + "px)",
                    "-moz-transform": "translateX(" + x + "px)",
                    "-o-transform": "translateX(" + x + "px)",
                    "-ms-transform": "translateX(" + x + "px)"
                });

                if (callback) {
                    setTimeout(function() {
                        callback(this_obj, obj);
                    }, duration);
                }
            }
        },

        // 设置透明度样式
        // obj: 设置对象
        // duration: 动画时间，毫秒数
        // callback: 完成回调
        setFadeTo: function(obj, duration, callback) {

            var this_obj = this;

            // 判断
            var transition = obj[0].style.transition;

            if (transition === undefined || transition === null) {
                obj.last().fadeOut(duration, function() {
                    if (callback) {
                        callback(this_obj, obj);
                    }
                });
            } else {

                // obj.one("transitionend", function() {
                //     // obj.css("transition", "none");
                //     console.log("here");
                //     if (callback)
                //         callback(this_obj, obj);
                // });


                obj.css({
                    "transition": "opacity " + duration * 0.001 + "s linear",
                    "opacity": 0
                });

                if (callback) {
                    setTimeout(function() {

                        if (callback)
                            callback(this_obj, obj);
                    }, duration);
                }
            }
        }
    };
}

if (typeof define === "function" && define.amd) {
    define(function() {
        return RotatingBanner;
    });
}