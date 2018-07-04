/*
    1.1.6
    高京
    2016-08-29
    JS类库
*/

var functions = {

    /*
        高京
        2017-10-25
        过滤表单非法字符
        @str: 需要过滤的字符串
    */
    convers: function(str) {

        var result = str;

        var regExp = new RegExp("\'", "ig");
        result = result.replace(regExp, "&acute;");

        regExp = new RegExp("\<", "ig");
        result = result.replace(regExp, "&lt;");

        regExp = new RegExp("\"", "ig");
        result = result.replace(regExp, "&quot;");

        return result;
    },

    /*
        高京
        2017-08-02
        日期格式化_仿微信
        @_date: 日期
    */
    dateFormat_wx: function(_date) {

        var date = new Date(_date);

        var year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate(),
            hour = date.getHours(),
            minute = date.getMinutes();

        var str = "";
        date = new Date();

        if (date.getFullYear() == year && date.getMonth() + 1 == month && date.getDate() == day)
            str = "";
        else {
            str = year + "年";
            // if (month < 10)
            //     str += "0";
            str += month + "月";
            // if (day < 10)
            //     str += "0";
            str += day + "日 ";
        }


        if (hour < 10)
            str += "0";
        str += hour + ":";
        if (minute < 10)
            str += "0";
        str += minute;
        // str += ":";
        // if (second < 10)
        //     str += "0";
        // str += second;

        return str;
    },

    /*
        高京
        2018-01-16
        判断mobile系统，返回 ios | android | others
    */
    judge_mobile_os: function() {
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

        if (isiOS)
            return "ios";
        else if (isAndroid)
            return "android";
        else
            return "others";
    },

    /*
        高京
        2018-01-08
        iphoneX底部需要空出来的高度(px)
    */
    iphoneX_bottom_space_px: 20,

    /*
        高京
        2018-01-16
        给iphoneX+微信浏览器：修改底部fixed盒的bottom；增加占位遮罩层；修改文档流内的占位盒高度
        建议默认将底部fixed盒隐藏，回调中显示

        opt = {
            bottom_fixed_selector: "", // 底部fixed盒的选择器，此盒将被修改bottom，无默认值
            document_fixed_space_selector: "", // 文档流内的占位盒选择器，此盒将被增加高度，无默认值
            fixed_space_div_bgColor: "#fff", // 底部新建占位遮罩盒的背景色，默认"#fff"，建议和页面背景色一致，以免穿帮
            callback: function(fixed_space_div) { // 回调(新建的底部占位遮罩层||undefined)，无论是否为iphoneX+微信浏览器都会执行
                fixed_space_div && fixed_space_div.css({
                    "background": "#000"
                });
            } 
        }
    */
    judge_iphoneX_MicroMessenger_changeStyle: function(opt) {
        var that = this;
        var opt_default = {
            bottom_fixed_selector: "",
            document_fixed_space_selector: "",
            fixed_space_div_bgColor: "#fff",
            callback: function() {}
        };
        opt = $.extend(opt_default, opt);

        var bottom_fixed_space_div;
        if (that.judge_iphoneX() && that.judge_MicroMessenger() && window.history.length === 1) {

            // 设置底部fixed盒的bottom
            $(opt.bottom_fixed_selector).css({
                "bottom": that.iphoneX_bottom_space_px + "px"
            });

            // 新建底部占位遮罩盒
            bottom_fixed_space_div = $(document.createElement("div"))
                .addClass("bottom_fixed_space_div")
                .css({
                    "position": "fixed",
                    "left": "0",
                    "bottom": "0",
                    "width": "100vw",
                    "height": that.iphoneX_bottom_space_px + "px",
                    "background": opt.fixed_space_div_bgColor
                })
                .appendTo($("body"));

            // 调整文档流内的占位盒高度
            var document_fixed_space_obj = $(opt.document_fixed_space_selector);
            if (document_fixed_space_obj.length > 0)
                document_fixed_space_obj.css({
                    "height": (parseFloat(document_fixed_space_obj.css("height").replace("px", "")) + that.iphoneX_bottom_space_px).toString() + "px"
                });
        }

        if (opt.callback)
            opt.callback(bottom_fixed_space_div);
    },

    /*
        高京
        2018-01-08
        判断ios设备是不是iphoneX (true/false)
    */
    judge_iphoneX: function() {
        var regExp = new RegExp("iphone", "ig"),
            isIphone = regExp.test(window.navigator.userAgent),
            isX = isIphone && screen.availHeight == 812;

        return isX;
    },

    /*
        高京
        2018-01-08
        判断是不是微信浏览器 (true/false)
    */
    judge_MicroMessenger: function() {
        var regExp = new RegExp("MicroMessenger", "ig"),
            isMicroMessenger = regExp.test(window.navigator.userAgent);

        return isMicroMessenger;
    },

    /*
        胡天培
        2018-01-08
        解决移动端h5页面文档流中input和textarea获得焦点后被键盘遮挡的bug
        目前的思路是将焦点滚动到一个安全的可视位置
        ios 10/11.2 可测。11.1实在找不到
        android 尽量多机型和系统

        2018-01-08 胡天培
        ios问题不大，只处理安卓

        @opt = {
            Listener_selector: "",   //监听focus的dom选择器，默认"input,textarea"
            wrapper_selector:"",      //最外盒选择器，如.wrapper或body 默认为：body
        }
    */
    fix_h5_input_focus_position: function(opt) {

        var that = this;

        var opt_default = {
            Listener_selector: "input,textarea"
        };

        opt = $.extend(opt_default, opt);

        // 监听对象
        var listener_obj = $(opt.Listener_selector);

        // focus的handler
        var focus_handler = function() {

            //判断设备
            var os = that.judge_mobile_os();
            if (os == "android") {

                // 获得最外盒对象
                var wrapper_obj = $(opt.wrapper_selector);
                if (wrapper_obj.length === 0)
                    return;

                //获取已滚动的距离
                var scrollTop_old_px = wrapper_obj.scrollTop();

                //获取focus元素距离document顶部的距离
                var focus_dom_top_px = $(this).offset().top;

                setTimeout(function() {
                    //最外盒向上滚动，让focus盒到预期位置
                    wrapper_obj.scrollTop(scrollTop_old_px + focus_dom_top_px - 100);
                }, 1000);
            }
        };


        // 监听focus
        listener_obj.unbind("focus").on("focus", focus_handler);
    },

    /*
        高京
        2017-08-02
        解决 h5页面 fixed居底input被键盘遮挡的问题
        
        2018-01-14：
        iphoneX(测试版本11.2.2)+微信浏览器：fixed居底的input移动到顶部
        其他环境不处理

        @opt = {
            dom_selector, // 监听focus和blur的Dom的选择器
            autocheck: false, // 自动执行innerHeight的改变监听，解决h5页面input.focus()后不能进入.on("focus")的handler的问题。默认false
            callback // 执行完focus_handler和blur_handler的回调
        }
    */
    fix_fixed_bottom_input: function(opt) {

        var opt_default = {
            autocheck: false
        };
        opt = $.extend(opt_default, opt);

        var dom_obj = $(opt.dom_selector);
        if (dom_obj.length === 0)
            return;

        // dom_obj的父盒遍历，position=fixed
        var box_obj = dom_obj.parent();
        while (box_obj.length > 0 && box_obj.css("position") != "fixed") {
            // console.log(box_obj);
            box_obj = box_obj.parent();
        }

        // 判断是否为 iphoneX
        var isIphoneX = (function() {
            var regExp = new RegExp("iphone", "ig"),
                isIphone = regExp.test(window.navigator.userAgent),
                isX = isIphone && screen.availHeight == 812;

            return isX;
        })();

        // 判断是否为微信浏览器
        var isMicroMessenger = (function() {
            var regExp = new RegExp("MicroMessenger", "ig"),
                isMicroMessenger = regExp.test(window.navigator.userAgent);

            return isMicroMessenger;
        })();

        // 非（iphoneX+微信浏览器）退出
        if (!(isIphoneX && isMicroMessenger))
            return;

        var box_obj_bottom; // 原先的bottom值
        // foucs处理
        var focus_handler = function() {
            box_obj_bottom = box_obj.css("bottom");
            box_obj.css({
                bottom: "100px"
            });

            $(".bottom_fixed_space_div").css("height", "100px");

            if (opt.callback)
                opt.callback();
        };

        // blur处理
        var blur_handler = function() {
            setTimeout(function() {

                box_obj.css({
                    "bottom": box_obj_bottom
                });

                $(".bottom_fixed_space_div").css("height", box_obj_bottom);

                if (opt.callback)
                    opt.callback();
            }, 0);
        };

        // 监听focus
        dom_obj.unbind("focus").on("focus", focus_handler);

        // 监听blur
        dom_obj.unbind("blur").on("blur", blur_handler);

        if (opt.autocheck)
            focus_handler();
    },


    /*
        高京
        2017-06-07
        乘除法计算，解决小数计算误差
        * kind：1-乘法（cal1×cal2） 2-除法（cal1÷cal2）
    */
    calculate: function(kind, cal1, cal2) {
        cal1 = cal1 || 1;
        cal2 = cal2 || 1;
        var lastDealNum = 0,
            i,
            str1 = cal1.toString(),
            str2 = cal2.toString(),
            str_lastDealNum = "1";

        // 根据小数点位置，获取需要处理的倍数
        var get_lastDealNum = function(str) {
            i = str.indexOf(".");
            if (i == -1)
                return 0;
            else
                return str.length - i - 1;
        };

        // 累加str1和str2对应的倍数
        lastDealNum += get_lastDealNum(str1);
        lastDealNum += get_lastDealNum(str2);

        // 根据需要处理的倍数，生成最后处理的数
        for (i = 0; i < lastDealNum; i++) {
            str_lastDealNum += "0";
        }

        // 计算
        switch (kind) {
            case 1:
                return parseFloat(str1.replace(".", "")) * parseFloat(str2.replace(".", "")) / parseFloat(str_lastDealNum);
            case 2:
                return parseFloat(str1.replace(".", "")) / parseFloat(str2.replace(".", "")) / parseFloat(str_lastDealNum);
            default:
                return 0;

        }
    },

    /*
        高京
        2016-09-10

        改变容器的scrollTop属性动画方法——解决zepto不支持animate改变scrollTop的动画问题
        
        opt = {
            obj_selector: "div.box", // 滚动元素。默认：window
            toTop_px: 0, // 滚至位置，像素。默认：0
            durTime_ms: 200, // 滚动至toTop_px所用时间，毫秒。默认：200
            callback: function(){} // 回调方法
        };

        使用时可以先用animate尝试改变，成功后再次调用此方法。如：
            $("html,body").animate({ scrollTop: "0px" }, 200, function() {
                functions.scrollTop({
                    callback: function() {
                        console.log("success");
                    }
                });
            });
    */

    scrollTop: function(opt) {
        var opt_default = {
            obj_selector: window,
            toTop_px: 0,
            durTime_ms: 200
        };
        opt = $.extend(opt_default, opt);

        if (opt.obj_selector === "window")
            opt.obj_selector = window;

        var perTime = 20;

        var scrollTop_selector = opt.obj_selector == window ? "html,body" : opt.obj_selector;
        var obj = $(scrollTop_selector);
        var top_now_px = obj.scrollTop();
        var top_per_px = (opt.toTop_px - top_now_px) / opt.durTime_ms * perTime;

        var set_scrollTop = function() {
            obj.scrollTop(obj.scrollTop() + top_per_px);
            var stop_toTop_bool = top_per_px <= 0 && (obj.scrollTop() + top_per_px) <= opt.toTop_px;
            var stop_toDown_bool = top_per_px >= 0 && (obj.scrollTop() + top_per_px) >= opt.toTop_px;
            if (stop_toTop_bool || stop_toDown_bool) {
                obj.scrollTop(opt.toTop_px);

                if (opt.callback)
                    opt.callback();
                return;
            } else {
                stop_toDown_bool = top_per_px >= 0 && (obj.scrollTop() + $(window).height() >= obj[0].scrollHeight);
                if (!stop_toDown_bool)
                    setTimeout(function() {
                        set_scrollTop();
                    }, perTime);
            }
        };

        set_scrollTop();
    },

    /*
        高京
        2016-02-24
        复制对象
            myOjb: 源对象
    */
    clone: function(myObj) {
        if (typeof(myObj) != 'object') return myObj;
        if (myObj === null) return myObj;

        var myNewObj = {};

        for (var i in myObj)
            myNewObj[i] = functions.clone(myObj[i]);

        return myNewObj;
    },
    /*
        高京
        2016-01-02
        插入css3的keyframes rule
            style：rule
    */
    insert_keyframe: function(style) {
        var _obj = document.styleSheets[0];
        if (_obj.insertRule)
            _obj.insertRule(style, 0);
        else
            _obj.appendRule(style, 0);
    },

    /*
        高京
        2016-01-02
        监听webkitAnimation
            selector：要监听的selector
            Callback_end：animation结束时的回调，可为null
            Callback_start：animation开始时的回调，可为null
            Callback_iteration：animation进行循环时的回调，可为null
    */
    webkitAnimationListen: function(selector, Callback_end, Callback_start, Callback_iteration) {
        var obj = document.querySelector(selector);
        if (Callback_end) {
            obj.addEventListener("webkitAnimationEnd", Callback_end);
        }
        if (Callback_start) {
            obj.addEventListener("webkitAnimationStart", Callback_start);
        }
        if (Callback_iteration) {
            obj.addEventListener("webkitAnimationIteration", Callback_iteration);
        }
    },

    /*
        高京
        2016-01-02
        移动端解决微信浏览器上下灰条并执行内部移动
            需要jquery或zepto支持
            selector: 固定高度的盒选择器。如.panel
            overflow_scrolling：是否执行盒内部移动。true-移动 else-不移动
    */
    mobile_stop_moved: function(selector, overflow_scrolling) {
        $(selector).css("overflow", "scroll");

        // 终止body应有的滚动事件
        $(document).on('touchmove', function(e) {
            e.preventDefault();
        });

        if (overflow_scrolling) {
            // $(selector).css("overflow", "scroll");
            $(selector).css("-webkit-overflow-scrolling", "touch");
            $("body").on('touchstart', selector, function(e) {
                var el = e.currentTarget;
                if (el.scrollTop === 0) {
                    el.scrollTop = 1;
                } else if (el.scrollHeight == el.scrollTop + el.offsetHeight) {
                    el.scrollTop = el.scrollTop - 1;
                }

            });
            $("body").on('touchmove', selector, function(e) {
                var el = e.currentTarget;
                if (el.scrollTop === 0)
                    return;
                e.stopPropagation();
            });
        }
    },

    /*
        @高京
        @20150909
        li_click和li_touchstart盒的监听，自动跳转

        @2018-01-18 高京
        在需要监听li_click或li_touchstart盒的页面，需要自行执行li_click_Listener方法进行监听
     */
    li_click_Listener: function() {

        // @dom_obj：点击的盒对象
        var handler = function(dom_obj) {

            $("#link_new_window").remove();
            $("body").append("<a id=\"link_new_window\" href=\"" + dom_obj.attr("url") + "\" target=\"" + dom_obj.attr("target") + "\" style=\"cursor:pointer\"><span></span></a>");
            //safari
            try {
                var e = document.createEvent('MouseEvent');
                e.initEvent('click', false, false);
                var sub = document.getElementById("link_new_window");
                sub.dispatchEvent(e);
            }
            //!safari
            catch (ee) {
                $("#link_new_window span").click();
            }
        };

        $(".li_touchstart").unbind("touchstart mousedown").on("touchstart mousedown", function(e) {
            e.preventDefault();
            handler($(this));
        });

        $(".li_click").unbind("click").on("click", function() {
            handler($(this));
        });
    },

    /*
     *@高京
     *@20151006
     *在页面中引用其他js文件
     */
    includeJS: function(path) {
        var a = document.createElement("script");
        a.type = "text/javascript";
        a.src = path;
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(a);
    },

    /*
     *@高京
     *@20151010
     *在页面中引用css文件
     */
    includeCSS: function(path) {
        var a = document.createElement("link");
        a.type = "text/css";
        a.rel = "stylesheet";
        a.href = path;
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(a);
    },

    /*
     *@高京
     *@20151023
     *获得地址栏参数集，返回JSON对象

     * 高京 2018-01-24 更新。正则拆解，返回json对象
     */
    getQueryParas: function() {

        var query = decodeURI(location.search.substring(1)),
            query_j = {};
        // alert(query);
        var regExp = new RegExp("(.+?)=(.+?)(?:\&|$)", "ig");
        var result;

        while (true) {
            result = regExp.exec(query);
            if (!result)
                break;
            query_j[result[1]] = result[2];
        }

        return query_j;
    },

    /*
     *@高京
     *@20151023
     *自动获得地址栏参数集，并拼接为地址栏字符串：a=1&b=2&c=3
     *Para：过滤掉的参数名（键），多个用|分隔，区分大小写
     */
    transParameters: function(Para) {
        return functions.getQueryParas_str(2, Para);
    },

    /*
     *@高京
     *@20151023
     *获得地址栏参数集，返回JSON字符串或地址栏字符串
     *Kind：拼接种类。1-JSON字符串；2-地址栏字符串
     *Para：过滤掉的参数名（键），多个用|分隔
     */
    getQueryParas_str: function(Kind, Para) {
        var url = location.href;
        var s = url.indexOf("?");
        var str = "";

        //将|分隔的Para替换为<><><>格式
        try {
            Para = "<" + Para.replace(/\|/g, "><") + ">";
        } catch (e) {
            console.log("e:" + e);
        }


        if (s > -1) {
            url = url.substring(s + 1);
            var e = url.indexOf("=");
            var key;
            var value;
            while (e > -1) {
                key = url.substring(0, e).replace("&", "");

                //判断获得的键名是否过滤
                if (Para.indexOf("<" + key + ">") > -1) {
                    e = url.indexOf("&");
                    if (e == -1)
                        break;
                    url = url.substring(e + 1);
                    e = url.indexOf("=");
                    continue;
                }

                url = url.substring(e + 1);
                e = url.indexOf("&");
                if (e == -1)
                    value = url.substring(0);
                else
                    value = url.substring(0, e);
                url = url.substring(e + 1);
                e = url.indexOf("=");
                if (str !== "") {
                    if (Kind == 1)
                        str += ",";
                    else
                        str += "&";
                }

                if (Kind == 1)
                    str += "\"" + key + "\":\"" + value + "\"";
                else
                    str += key.replace("&", "") + "=" + value;
            }
        }

        if (Kind == 1) {
            str = "{" + str + "}";
        }

        return str;
    },

    /*
     *@高京
     *@20150909
     *判断是否为PC端访问，返回true/false
     */
    isPc: function() {
        var system = {
            win: false,
            mac: false,
            xll: false
        };

        //检测平台
        var p = navigator.platform;
        //alert(p);
        system.win = p.indexOf("Win") === 0;
        system.mac = p.indexOf("Mac") === 0;
        system.x11 = (p === "X11") || (p.indexOf("Linux") === 0);

        if (system.win || system.mac || system.xll) {
            return true;
        } else {
            return false;
        }
    },

    /*
     *@陈斌
     *@20160103
     * 传入字符串。返回字符串长度数值
     */

    StrLength: function(Str) {
        var _i = 0;
        var _n = Str.length;
        var _c; //遍历Str时的Char值
        var _l = 0; //记录字符串长度
        for (_i; _i < _n; _i++) {

            //根据字符ASCII判断占用字节数
            _c = Str.charCodeAt(_i);
            if (_c <= 126)
                _l += 1;
            else
                _l += 2;
        }

        return _l;
    }
};

if (typeof define === "function" && define.amd) {
    define(function() {
        return functions;
    });
}