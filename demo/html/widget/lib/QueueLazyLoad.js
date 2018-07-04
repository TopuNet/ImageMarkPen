/*
    v1.1.1
    高京
    2016-08-19
    按照队列顺序延迟(懒)加载DOM中的图片
*/
function QueueLazyLoad() {
    return {
        init: function(opt) {
            var opt_default = {
                Queue: ["body"], // 加载DOM选择器队列，数组。默认["body"]。如：["section.top","#main","div.footer"]
                Callback_success_Queue: null, // 队列中每个DOM完成时的回调，方法数组。无默认值。如：[function(){ alert("aa"); },function(){ alert("bb"); },function(){ alert("cc"); }]
                Callback_success_All: null // 队列全部加载后的回调
            };

            this.opt = $.extend(opt_default, opt);

            // 启动队列轮询
            this.QueueStart.apply(this);
        },
        // 启动队列轮询
        QueueStart: function() {
            var _this = this;
            var i = 0,
                len = _this.opt.Queue.length;

            var deal = function() {
                _this.QueueLoad(i, _this.opt.Queue[i], function() {
                    if (_this.opt.Callback_success_Queue) {
                        try {
                            _this.opt.Callback_success_Queue[i]();
                        } catch (e) {}
                    }
                    if (++i >= len) {
                        if (_this.opt.Callback_success_All) {
                            _this.opt.Callback_success_All();
                        }
                    } else {
                        deal();
                    }
                });
            };

            deal();
        },
        // 执行预加载
        // Queue_index: 加载序号
        // box_selector: 外盒选择器
        // load_success: 加载完成回调
        QueueLoad: function(Queue_index, box_selector, load_success) {
            var LoadBg_obj = $(box_selector + "[qll-bg]," + box_selector + " [qll-bg]");
            var LoadImg_obj = $(box_selector + "[qll-img]," + box_selector + " [qll-img]");
            var loaded_count = 0; // 已加载数量

            var loaded = function() {
                if (++loaded_count >= LoadBg_obj.length + LoadImg_obj.length) {
                    load_success();
                }
            };

            // 无需加载
            if (LoadBg_obj.length + LoadImg_obj.length === 0) {
                loaded();
            }

            // 预加载背景
            var loop_load_bg = function() {
                return function(_i) {
                    var _obj = $(LoadBg_obj[_i]);
                    _obj.attr("style", _obj.attr("qll-bg"));
                    _obj.removeAttr("qll-bg");
                    var img = new Image();
                    var src = _obj[0].style.backgroundImage.replace("url(", "").replace(")", "").replace(/'/g, "").replace(/"/g, "");
                    img.src = src;
                    if (img.complete) {
                        loaded();
                    } else {
                        img.onload = function() {
                            loaded();
                        };
                        img.onerror = function() {
                            loaded();
                        };

                    }
                };
            }();

            var i = 0,
                len = LoadBg_obj.length;
            for (; i < len; i++) {
                loop_load_bg(i);
            }

            // 预加载图片
            var loop_load_img = function() {
                return function(_j) {
                    var _obj = $(LoadImg_obj[_j]);
                    var img = new Image();
                    img.src = _obj.attr("qll-img");
                    _obj.removeAttr("qll-img");
                    if (img.complete) {
                        _obj.attr("src", img.src);
                        loaded();
                    } else {
                        img.onload = function() {
                            _obj.attr("src", img.src);
                            loaded();
                        };
                        img.onerror = function() {
                            loaded();
                        };
                    }
                };
            }();

            var j = 0,
                len2 = LoadImg_obj.length;
            for (; j < len2; j++) {
                loop_load_img(j);
            }
        }
    };
}

if (typeof define === "function" && define.amd) {
    define(function() {
        return QueueLazyLoad;
    });
}
