/*
	v1.1.1
	高京
	2016-12-03
	拖拽层改变顺序
*/

/* jshint esversion: 6 */
/*
	this:{
		opt:{
                wrapper_box_selector: null, // 外盒选择器，无默认值。不能有padding和margin。如：ul.box
                items_box_selector: "li.item", // 单元选择器，不用涵盖外盒选择器。默认：li.item
                items_box_drag_class: "draging", // 单元拖拽时的样式名称。默认：draging
                items_box_space_class: "sapce" // 单元占位盒的样式名称。默认：space
		},
		WrapperObj: 外盒对象,
		ItemsObj: 单元对象,
		Wrapper_width_px: 外盒宽度,
		Dom_ItemSpace: 项目单元占位盒
	}
*/

var LayerDrag = function() {
    return {
        init: function(opt) {

            // 设置this.opt
            this.optSet.apply(this, [opt]);

            // 设置全局变量
            this.WrapperObj = $(this.opt.wrapper_box_selector); // 外盒对象
            this.ItemsObj = this.WrapperObj.find(this.opt.items_box_selector); // 单元对象

            // 创建必要的Dom
            this.CreateDom.apply(this);

            // 对项目单元盒进行拖拽监听
            this.ItemsBoxDragListener.apply(this);
        },
        // 设置this.opt
        optSet: function(opt) {
            var that = this;
            var opt_default = {
                wrapper_box_selector: null, // 外盒选择器，无默认值。不能有padding和margin。如：ul.box
                items_box_selector: "li.item", // 单元选择器，不用涵盖外盒选择器。默认：li.item
                items_box_drag_class: "draging", // 单元拖拽时的样式名称。默认：draging
                items_box_space_class: "sapce" // 单元占位盒的样式名称。默认：space
            };
            that.opt = $.extend(opt_default, opt);
        },
        // 对项目单元盒进行拖拽监听
        ItemsBoxDragListener: function() {
            var that = this;

            // 记录项目单元位置
            var ItemPosition_px = {
                top: null,
                left: null
            };

            // 记录鼠标相对位置
            var mouse_client_px = {
                x: null,
                y: null
            };

            // touchstart
            that.ItemsObj.on("touchstart mousedown", function(e) {

                e.preventDefault();
                var _this_obj = $(this);

                // 记录是否被拖动过
                var dragged = false;

                // 记录项目单元位置
                ItemPosition_px = _this_obj.position();

                // 将焦点盒变为绝对定位
                _this_obj.addClass(that.opt.items_box_drag_class)
                    .css({
                        "position": "absolute",
                        "z-index": 501,
                        "top": ItemPosition_px.top + "px",
                        "left": ItemPosition_px.left + "px"
                    });

                // 将占位插到焦点盒下面
                that.Dom_ItemSpace.addClass(that.opt.items_box_space_class)
                    .css({
                        "width": _this_obj.css("width"),
                        "height": _this_obj.css("height")
                    }).show(0);
                _this_obj.before(that.Dom_ItemSpace);

                // 记录鼠标相对屏幕位置
                mouse_client_px.x = e.clientX;
                mouse_client_px.y = e.clientY;

                // touchmove
                $(window).on("touchmove mousemove", function(e) {

                    e.preventDefault();

                    dragged = true;

                    // 计算鼠标移动距离
                    var mouse_diff_px = {
                        x: e.clientX - mouse_client_px.x,
                        y: e.clientY - mouse_client_px.y
                    };

                    // 改变原始值
                    ItemPosition_px.left = parseFloat(ItemPosition_px.left) + parseFloat(mouse_diff_px.x);
                    ItemPosition_px.top = parseFloat(ItemPosition_px.top) + parseFloat(mouse_diff_px.y);
                    mouse_client_px.x = e.clientX;
                    mouse_client_px.y = e.clientY;

                    // 移动项目单元
                    _this_obj.css({
                        "left": ItemPosition_px.left + "px",
                        "top": ItemPosition_px.top + "px"
                    });

                    // 判断鼠标是否悬浮于其他盒内
                    var checkHover = function(_item_obj) {
                        var _position_px = _item_obj.position();
                        var position = {
                            x1: _position_px.left,
                            y1: _position_px.top,
                            x2: _position_px.left + _item_obj.outerWidth(),
                            y2: _position_px.top + _item_obj.outerHeight()
                        };

                        var mouse = {
                            x: e.clientX - that.WrapperObj.position().left,
                            y: e.clientY - that.WrapperObj.position().top
                        };

                        var x_ok = position.x1 <= mouse.x && mouse.x <= position.x2;
                        var y_ok = position.y1 <= mouse.y && mouse.y <= position.y2;

                        // console.log(mouse.x, mouse.y, position.x1, position.x2, position.y1, position.y2);

                        if (x_ok && y_ok)
                            return true;
                        else
                            return false;

                    };

                    // 遍历项目单元，判断是否悬浮。
                    for (var _item_obj of that.ItemsObj) {
                        _item_obj = $(_item_obj);

                        // 排除拖拽单元
                        if (_item_obj.hasClass("draging"))
                            continue;

                        // 根据是否悬浮，决定样式
                        if (checkHover(_item_obj)) {
                            _item_obj.addClass("beHover");
                        } else {
                            _item_obj.removeClass("beHover");
                        }
                    }
                });

                // touchend
                $(window).on("touchend mouseup", function(e) {

                    e.preventDefault();

                    // 停止拖拽监听
                    $(window).unbind("touchmove mousemove touchend mouseup");

                    if (!dragged)
                        return;

                    // 占位盒的位置
                    var Dom_ItemSpace_position_px = that.Dom_ItemSpace.position();

                    // 收尾方法，隐藏占位盒，还原拖拽盒的z-index，清除拖拽盒和被悬浮盒ClassName
                    var WindUp = function() {

                        // 隐藏占位盒
                        that.Dom_ItemSpace.hide(0);

                        // 还原拖拽盒
                        _this_obj.css({
                            "z-index": 500,
                            "position": "inherit",
                            "top": "auto",
                            "left": "auto"
                        }).removeClass("draging");

                        // 清除被悬浮盒的ClassName
                        that.WrapperObj.find(".beHover").removeClass("beHover");

                        // 重新获得项目单元对象集合
                        that.ItemsObj = that.WrapperObj.find(that.opt.items_box_selector);

                    };

                    // 判断是否有被悬层
                    var item_beHover = that.WrapperObj.find(".beHover");
                    if (item_beHover.length === 0) { // 没有，将拖拽层还原位置
                        _this_obj.animate({
                            "top": Dom_ItemSpace_position_px.top,
                            "left": Dom_ItemSpace_position_px.left
                        }, 100, WindUp);
                    } else { // 有，移动相关盒

                        // 被悬浮盒对象
                        var beHover_obj = $(item_beHover[0]);

                        // 被悬浮盒的序数
                        var beHover_index = that.ItemsObj.index(beHover_obj);

                        // 拖拽盒的序数
                        var draging_index = that.ItemsObj.index(_this_obj);

                        // 判断向前移动还是向后移动，再做出相应处理
                        if (draging_index > beHover_index) { // 向前

                            beHover_obj.before(_this_obj);
                            WindUp();

                        } else { // 向后

                            beHover_obj.after(_this_obj);
                            WindUp();
                        }

                    }
                });
            });
        },
        // 创建必要的Dom
        CreateDom: function() {
            var that = this;

            // 项目单元占位盒
            that.Dom_ItemSpace = $(that.ItemsObj[0]).clone()
                .html("")
                .css({
                    "z-index": 499,
                    "display": "none"
                }).appendTo(that.WrapperObj);
        }
    };
};

if (typeof define === "function" && define.amd) {
    define(["lib/jquery.min"], function() {
        return LayerDrag;
    });
}
