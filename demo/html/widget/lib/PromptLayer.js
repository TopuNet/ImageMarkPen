/*
 * v2.0.2
 * 提示框弹层
 */

var PromptLayer = {
    init: function() {

        // 初始化弹层
        this.Layer_init.apply(this);

        // 监听窗口resize
        this.resizeListening=false;
        this.window_resize_listener.apply(this);
    },
    // 初始化弹层
    Layer_init: function() {
        // 背景层
        this.dom_bg_Layer = $(document.createElement("div"))
            .css({
                "position": "fixed",
                "top": "0",
                "left": "0",
                "filter": "alpha(Opacity = 0)",
                "-moz-opacity": "0",
                "opacity": "0"
            });
        $("body").append(this.dom_bg_Layer);

        // 显示层
        this.dom_show_Layer = $(document.createElement("div"))
            .css({
                "position": "fixed",
                "top": "50%",
                "left": "50%",
                "display": "none",
                "cursor": "pointer"
            });
        $("body").append(this.dom_show_Layer);

        // 表格
        this.dom_table = $(document.createElement("table"))
            .css({
                "width": "100%",
                "height": "100%"
            })
            .append(document.createElement("tr"));
        $(this.dom_show_Layer.append(this.dom_table));

        // td
        this.dom_td = $(document.createElement("td"))
            .css({
                "vertical-align": "middle",
                "text-align": "center",
                "background-color": "#fff",
                "border-radius": "10px",
                "line-height": "25px"
            });
        this.dom_table.find("tr").append(this.dom_td);

    },
    // 调整宽高及位置
    position_reinit: function() {

        var _this = this;

        var window_width_px = $(window).width();
        var window_height_px = $(window).height();

        // 背景层
        _this.dom_bg_Layer.css({
            "background-color": _this.Paras.bg_Layer_color,
            "width": window_width_px + "px",
            "height": window_height_px + "px",
            "z-index": _this.Paras.z_index
        });

        // 内容层
        _this.dom_show_Layer.css({
            "width": _this.Paras.width + _this.Paras.unit,
            "height": _this.Paras.height + _this.Paras.unit,
            "z-index": _this.Paras.z_index + 1,
            "margin-left": -_this.Paras.width / 2 + _this.Paras.unit,
            "margin-top": -_this.Paras.height / 2 + _this.Paras.unit
        });

        // 内容td
        _this.dom_td.css({
            "font-size": _this.Paras.fontSize + _this.Paras.fontUnit
        });
    },
    //弹框
    // obj {
    //     str: "提示内容",
    //     t: 0 - 自动关闭（默认） 1 - 不自动关闭,
    //     width:"宽度",  默认300
    //     height:"高度", 默认100
    //     unit:宽高单位 "px|vw", 默认px，且IE6/7/8强制使用px
    //     fontSize:"字体大小", 默认16。
    //     fontUnit:字体单位 "px|vw", 默认px，且IE6/7/8强制使用px。
    //     z_index: 弹层的z-index，内容盒为z_index+1，默认400 
    //     close_timer_ms: 弹层自动关闭时间，单位毫秒。默认2500
    //     bg_Layer_color: 背景层颜色，默认#000
    //     bg_Layer_opacity: 背景层透明度，默认0.4
    //     callback_open:function(){弹出后的回调方法},
    //     callback_close:function(){关闭后的回调方法}
    // }

    show: function(opt) {
        var _this = this;

        // 允许监听窗口resize
        _this.resizeListening = true;

        // 让所有input和select和textarea失去焦点
        $("input,select,textarea").blur();

        // 设置默认值
        var opt_default = {
            str: "",
            t: 0,
            width: 300,
            height: 100,
            unit: "px",
            fontSize: 16,
            fontUnit: "px",
            z_index: 400,
            close_timer_ms: 2500,
            bg_Layer_color: "#ff0000",
            bg_Layer_opacity: 0.1
        };

        _this.Paras = $.extend(opt_default, opt);
        _this.Paras.unit = _this.Paras.unit.toLowerCase();

        //IE6/7/8强制使用px
        if (_this.Paras.unit != "px") {
            var browser = navigator.appName;
            if (browser == "Microsoft Internet Explorer") {
                var b_version = navigator.appVersion;
                var version = b_version.split(";");
                var trim_Version = version[1].replace(/[ ]/g, "");
                if (trim_Version == "MSIE6.0" || trim_Version == "MSIE7.0" || trim_Version == "MSIE8.0") {
                    _this.Paras.unit = "px";
                    _this.Paras.fontUnit = "px";
                }
            }
        }

        // 调整宽高及位置
        _this.position_reinit.apply(_this);

        // 设置文字内容
        _this.dom_td.text(_this.Paras.str);

        //显示遮罩层
        _this.dom_bg_Layer.fadeTo(100, _this.Paras.bg_Layer_opacity);
        _this.dom_show_Layer.fadeIn(100, function() {

            // 执行打开回调
            if (_this.Paras.callback_open)
                _this.Paras.callback_open();

            // 自动关闭
            if (_this.Paras.t === 0) {
                _this.global = setTimeout(function() {
                    _this.close.apply(_this, [_this.Paras.callback_close]);
                }, _this.Paras.close_timer_ms);
            }

            // 监听点击关闭
            _this.dom_show_Layer.unbind().on("touchstart mousedown", function(e) {
                e.preventDefault();
                _this.close.apply(_this, [_this.Paras.callback_close]);
            });
        });

    },
    //关闭弹框
    // callback_close：关闭后回调方法
    close: function(callback_close) {
        var _this = this;

        if (_this.global)
            clearTimeout(_this.global);
        _this.dom_bg_Layer.fadeTo(100, 0).css({
            "width": 0,
            "height": 0
        });
        _this.dom_show_Layer.fadeOut(100, function() {
            _this.dom_td.text("");
            if (callback_close) {
                callback_close();
            }
        });

        // 停止监听窗口resize
        _this.resizeListening = false;
    },
    // 监听窗口resize，改变背景盒宽高及弹层位置
    window_resize_listener: function() {
        var that = this;
        var resize_n = 0;
        $(window).resize(function() {
            if (that.resizeListening) {
                if ((++resize_n) % 2 === 0)
                    return;
                setTimeout(function() {
                    that.position_reinit.apply(that);
                    resize_n = 0;
                }, 0);
            }
        });
    }
};

if (typeof define === "function" && define.amd) {
    define(["/inc/jquery.min.js"], function() {

        PromptLayer.init();
        return PromptLayer;
    });
} else
    PromptLayer.init();
