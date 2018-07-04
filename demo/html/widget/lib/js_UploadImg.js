/*
    1.2.3
    js图片上传弹层组件
    高京
    2017-04-21

    this = {
        window_height_px: 窗口高度，setStyle时获取，不监听resize,
        layershow: LayerShow实例
        opt: {
            z_index: 弹层的z - index。 内容层为z_index + 1。 默认400
            input_file_width_percent: 文件域的宽度（百分比）。默认40————pc端合适
            Upload_ajaxUrl: 图片上传的提交路径，无默认
            useLibrary: 使用"我的图库"功能，默认 true
            Library_ajaxUrl: useLibrary=true 时有效，获取我的图库的ajax地址。返回内容格式：[{imgPath:"/UploadFile/xxx/yyy.jpg",imgSummary:"yyy"},{imgPath:"/UploadFile/xxx/yyy.jpg",imgSummary:"yyy"}]
            LayerShow: LayerShow对象，必须有且无默认值
            WaterFall: WaterFall对象，useLibrary=true时必须有且无默认值
            WaterFall_item_width: 200, // 项目单元宽度。不包含列间距。默认200
            WaterFall_line_top: 20, // 行 上间距。默认20
            WaterFall_line_first_top: 10, // 第一行 上间距。默认10
            WaterFall_column_left: 10, // 列 左间距。默认10
            WaterFall_column_first_left: 10, // 第一列 左间距。默认10
            WaterFall_unit: "px", // 距离单位。"px"||"vw"。默认"px"
            callback_before: 执行前回调，function，无默认
            callback_error: 报错时回调，function(err)，无默认
            callback_success: 弹层成功回调,function,无默认
            callback_upload:  上传成功回调，function(filepath)，无默认
            callback_close: 关闭后回调，function，无默认
        },
        doms: {
            wrapper: 最外盒,
            tags_ul: 标签行,
            tags_li_0: 标签-图片上传,
            tags_li_1: 标签-我的图库,
            content_wrapper: 内容外盒
            content_ul: 内容盒,
            content_li_0: 内容盒-图片上传,
            content_li_1: 内容盒-我的图库,
            input_file: 文件域,
            preview: 预览盒,
            button_upload_box: 上传按钮外盒,
            button_upload: 上传按钮,
            progress: 进度盒,
            myLibrary: 我的图库内容
        }
    }
*/

var js_UploadImg = {
    // 顶部tag高度
    TAG_HEIGHT_PX: 40,
    // 显示弹层
    show: function(opt) {
        var that = this;

        var opt_default = {
            z_index: 400, // 弹层的z - index。 内容层为z_index + 1。 默认400 
            input_file_width_percent: 40, // 文件域的宽度（百分比）。默认40————pc端合适
            Upload_ajaxUrl: null, // 图片上传的提交路径，无默认  /deal_uploadImg
            useLibrary: true, // 使用"我的图库"功能，默认 true
            Library_ajaxUrl: null, // useLibrary=true 时有效，获取我的图库的ajax地址。返回内容格式：[{imgPath:"/UploadFile/xxx/yyy.jpg",imgSummary:"yyy"},{imgPath:"/UploadFile/xxx/yyy.jpg",imgSummary:"yyy"}]
            LayerShow: null, // LayerShow对象，必须有且无默认值
            WaterFall: null, // WaterFall对象，useLibrary=true时必须有且无默认值
            WaterFall_item_width: 200, // 项目单元宽度。不包含列间距。默认200
            WaterFall_line_top: 20, // 行 上间距。默认20
            WaterFall_line_first_top: 10, // 第一行 上间距。默认10
            WaterFall_column_left: 10, // 列 左间距。默认10
            WaterFall_column_first_left: 10, // 第一列 左间距。默认10
            WaterFall_unit: "px", // 距离单位。"px"||"vw"。默认"px"
            callback_before: null, // 执行前回调，function，无默认
            callback_error: null, // 报错时回调，function(err)，无默认
            callback_success: null, // 弹层成功回调，function，无默认
            callback_upload: null, // 上传成功回调，function(filepath)，无默认
            callback_close: null // 关闭后回调，function，无默认
        };
        that.opt = $.extend(opt_default, opt);

        // 通过对JSON的支持，判断浏览器是否为ie7
        if (typeof JSON === "undefined") {
            that.errorExecFunc.apply(that, ["您的浏览器版本过低，请使用最新版chrome、safari、firefox、360极速或ie10以上等主流浏览器访问"]);
            return;
        }

        // 创建dom
        if (!that.doms) {
            that.create_dom.apply(that);
        }

        // 设置样式
        that.setStyle.apply(that);

        // 创建layershow实例
        if (!that.layershow)
            that.layershow = new that.opt.LayerShow();

        // 显示
        var _opt = {
            z_index: that.opt.z_index,
            showKind: 2,
            info_content: that.doms.wrapper_outer.html(),
            // info_box_width_per: showKind = 2 时有效， 内容盒宽度百分比。 默认80
            // info_box_height_per: showKind = 2 时有效， 内容盒高度百分比。 默认90
            // info_box_radius: showKind = 2 时有效， 内容盒是否圆角。 默认true
            // info_box_bg: showKind = 2 时有效， 内容盒背景。 默认 "#ffffff"
            info_box_padding_px: 0, // showKind = 2 时有效， 内容盒padding。 默认20
            // info_box_fontSize: showKind = 2 时有效， 内容盒字体大小。 默认 "14px"
            // info_box_fontColor: showKind = 2 时有效， 内容盒字体颜色。 默认 "#333"
            // info_box_lineHeight: showKind = 2 时有效， 内容盒行间距。 默认 "30px"
            info_box_use_JRoll: false,
            // JRoll_obj: that.opt.JRoll, // JRoll对象。 不使用JRoll做内容盒滚动， 可不传。
            // Pics_close_show: true / false。 显示关闭按钮。 默认true
            // Pics_close_path: 关闭按钮图片路径。 默认 / inc / LayerShow_close.png。
            callback_before: that.opt.callback_before, // 弹层前回调。 如显示loading层。 无默认
            callback_success: function() {

                // 设置交互样式
                that.setHoverStyle.apply(that);

                // 监听上传按钮
                that.button_upload_Listener.apply(that);

                // 监听文件域变换
                that.input_file_Listener.apply(that);

                // 监听tag切换
                that.tags_Listener.apply(that);

                if (typeof that.opt.callback_success === "function")
                    that.opt.callback_success();
            }, // 弹层成功———— 此时只加载了第一章图片———— 回调function(li)。 li为showKind = 1 时加载的第一且是唯一一张图片的li盒。 如关闭loading层。 无默认
            callback_close: function() {
                that.close.apply(that);
            } // 关闭弹层后的回调。 没想好如什么。 无默认
        };
        that.layershow.show(_opt);
    },
    // 创建dom
    create_dom: function() {
        var that = this;

        that.doms = {};

        // 最最外盒
        that.doms.wrapper_outer = $(document.createElement("div"));

        // 最外盒
        that.doms.wrapper = $(document.createElement("div")).appendTo(that.doms.wrapper_outer);

        // 标签行
        that.doms.tags_ul = $(document.createElement("ul")).addClass("js_UploadImg_tags_ul").appendTo(that.doms.wrapper);

        // 标签-图片上传
        that.doms.tags_li_0 = $(document.createElement("li"));
        that.doms.tags_li_0.addClass("js_UploadImg_tags_li")
            .addClass("js_UploadImg_tags_0")
            .addClass("js_UploadImg_tags_now")
            .text("图片上传")
            .appendTo(that.doms.tags_ul);

        // 标签-我的图库
        if (that.opt.useLibrary) {
            that.doms.tags_li_1 = $(document.createElement("li"));
            that.doms.tags_li_1.addClass("js_UploadImg_tags_li")
                .addClass("js_UploadImg_tags_1")
                .text("我的图库")
                .appendTo(that.doms.tags_ul);
        }

        // 内容盒-外盒
        that.doms.content_wrapper = $(document.createElement("div"))
            .addClass("js_UploadImg_content_wrapper")
            .appendTo(that.doms.wrapper);

        // 内容盒
        that.doms.content_ul = $(document.createElement("ul"))
            .addClass("js_UploadImg_content_ul")
            .appendTo(that.doms.content_wrapper);

        // 内容盒 - 图片上传
        that.doms.content_li_0 = $(document.createElement("li"))
            .addClass("js_UploadImg_content_li_0")
            .appendTo(that.doms.content_ul);

        // 文件域
        that.doms.input_file = $(document.createElement("input"));
        that.doms.input_file.attr("type", "file")
            .addClass("js_UploadImg_input_file")
            .appendTo(that.doms.content_li_0);

        // 预览盒
        that.doms.preview = $(document.createElement("div"));
        that.doms.preview.addClass("js_UploadImg_preview")
            .appendTo(that.doms.content_li_0);

        // 上传按钮外盒
        that.doms.button_upload_box = $(document.createElement("div"));
        that.doms.button_upload_box.addClass("js_UploadImg_button_upload_box")
            .appendTo(that.doms.content_li_0);

        // 上传按钮
        that.doms.button_upload = $(document.createElement("div"));
        that.doms.button_upload.addClass("js_UploadImg_button_upload")
            .text("上 传")
            .appendTo(that.doms.button_upload_box);

        // 进度条
        that.doms.progress = $(document.createElement("progress"))
            .attr({
                "min": "0",
                "max": "100"
            })
            .appendTo(that.doms.content_li_0);
    },
    // 设置样式
    setStyle: function() {
        var that = this;

        // 获得窗口高度
        that.window_height_px = $(window).height();

        // 顶部标签
        that.doms.tags_ul.css({
            "text-align": "center",
            "list-style": "none",
            "padding": "0",
            "margin": "0",
            "border-bottom": "solid 1px #333"
        });
        that.doms.tags_ul.find("li").css({
            "box-sizing": "border-box",
            "display": "inline-block",
            "width": "100%",
            "height": "40px",
            "line-height": "40px",
            "color": "#999"
        });
        that.doms.tags_ul.find(".js_UploadImg_tags_now").css({
            "font-weight": "bold",
            "background-color": "#fafafa",
            "color": "#000"
        });
        if (that.opt.useLibrary) {
            that.doms.tags_li_0.css({
                "width": "50%"
            });
            that.doms.tags_li_1.css({
                "border-left": "solid 1px #333",
                "cursor": "pointer",
                "width": "49%"
            });
        }

        // 内容外盒
        that.doms.content_wrapper.css({
            "position": "relative",
            "overflow": "hidden"
        });

        // 内容盒
        that.doms.content_ul.css({
            "margin": "0",
            "padding": "0",
            "overflow": "hidden"
        });

        // 文本域
        var _margin_left = 50 - that.opt.input_file_width_percent / 2;
        that.doms.input_file.css({
            "width": that.opt.input_file_width_percent + "%",
            "margin-top": that.window_height_px * 0.9 * 0.3 + "px",
            "margin-left": _margin_left + "%",
            "padding": "5px",
            "box-sizing": "border-box",
            "border": "dotted 1px #999"
        });

        // 预览盒
        that.doms.preview.css({
            "width": "80%",
            "height": that.window_height_px * 0.9 * 0.3 + "px",
            "margin-top": that.window_height_px * 0.9 * 0.05 + "px",
            "margin-left": "10%",
            "box-sizing": "border-box",
            "display": "none"
        });

        // 上传按钮外盒
        that.doms.button_upload_box.css({
            "text-align": "center",
            "margin-top": that.window_height_px * 0.9 * 0.3 + "px"
        });

        // 上传按钮
        that.doms.button_upload.css({
            "width": "100px",
            "border": "solid 1px #999",
            "border-radius": "5px",
            "display": "inline-block",
            "cursor": "pointer"
        });

        // 进度条
        that.doms.progress.css({
            "display": "none",
            "width": "80%",
            "margin": that.window_height_px * 0.9 * 0.05 + "px 10%"
        });
    },
    // 设置悬停交互样式
    setHoverStyle: function() {

        if (!$("body").hover)
            return;

        // 标签
        $(".js_UploadImg_tags_li").unbind();
        $(".js_UploadImg_tags_li:not(.js_UploadImg_tags_now)")
            .hover(function() {
                $(this).css("color", "#000");
            }, function() {
                $(this).css("color", "#999");
            });
    },
    // 监听文件域的变换
    input_file_Listener: function() {
        var that = this;
        if (typeof FileReader === "undefined")
            return;
        $(".js_UploadImg_input_file").unbind().on("change", function() {
            var file = that.checkInputFile();
            if (!file)
                return;
            var reader = new FileReader();
            reader.onload = function(event) {
                var image = new Image();
                image.src = event.target.result;
                $(".js_UploadImg_input_file").css({
                    "margin-top": that.window_height_px * 0.9 * 0.1 + "px"
                });
                $(".js_UploadImg_preview").css({
                    "background": "url('" + image.src + "') no-repeat center center",
                    "background-size": "contain",
                    "display": "block"
                });
                $(".js_UploadImg_button_upload_box").css({
                    "margin-top": that.window_height_px * 0.9 * 0.15 + "px"
                });
            };
            reader.readAsDataURL(file);
        });
    },
    // 监听上传按钮
    button_upload_Listener: function() {
        var that = this;
        $(".js_UploadImg_button_upload:not(.js_UploadImg_button_disabled)").unbind()
            .on("click", function() {
                $(this).addClass("js_UploadImg_button_disabled")
                    .css({
                        "color": "#999",
                        "cursor": "default"
                    });

                // 判断是否为图片
                var file = that.checkInputFile();
                if (!file) {
                    that.errorExecFunc.apply(that, ["请选择图片"]);
                    return;
                }

                // ajax执行上传
                that.dealUploadImg.apply(that, [file]);
            })
            .hover(function() {
                $(this).css({
                    "color": "#fff",
                    "background-color": "#999"
                });
            }, function() {
                $(this).css({
                    "color": "#333",
                    "background-color": ""
                });
            });;
    },
    // 验证文本域是否为图片。是的话返回file，否则返回null
    checkInputFile: function() {
        var that = this;

        // 文件域
        var input_file = $(".js_UploadImg_input_file");

        // 判断浏览器是否支持.files
        if (!input_file[0].files) {
            that.errorExecFunc.apply(that, ["您的浏览器不支持此操作，请使用最新版chrome、safari、firefox、360极速或ie10以上等主流浏览器访问"]);
            return;
        }

        // 获得文件域的值
        var file = input_file[0].files[0] || "";

        if (file === "" || !file.type.match(/^image\/.+/))
            return null;
        else
            return file;
    },
    // ajax执行上传
    // file: 文本域提交的文件对象
    dealUploadImg: function(file) {
        var that = this;
        if (!window.FormData) {
            that.errorExecFunc.apply(that, ["您的浏览器不支持此操作，请使用最新版chrome、safari、firefox、360极速或ie10以上等主流浏览器访问"]);
            return;
        }

        var formData = new FormData();
        formData.append("img1", file);

        var xhr = new XMLHttpRequest();
        xhr.open("post", that.opt.Upload_ajaxUrl);
        xhr.upload.onprogress = function(event) {
            if (event.lengthComputable) {
                var complete = event.loaded / event.total * 100;
                $("progress").val(complete)
                    .css({
                        "display": "block"
                    })
                    .text(complete);
            }
        };
        xhr.onload = function() {
            // that.doms.progress.css({
            //     "display": "none"
            // });
            $(".js_UploadImg_button_upload").removeClass("js_UploadImg_button_disabled")
                .css({
                    "color": "#333",
                    "cursor": "pointer"
                });
            if (typeof that.opt.callback_upload === "function") {

                that.opt.callback_upload(xhr.response);

                that.layershow.close();

            }
        };
        xhr.send(formData);
    },
    // 监听tag切换
    tags_Listener: function() {
        var that = this;
        $(".js_UploadImg_tags_li:not(.js_UploadImg_tags_now)").one("click", function() {

            // 切换tag样式
            $(".js_UploadImg_tags_li").toggleClass("js_UploadImg_tags_now");
            // $(this).addClass("js_UploadImg_tags_now");
            $(".js_UploadImg_tags_li").css({
                "font-weight": "normal",
                "background-color": "",
                "color": "#999",
                "cursor": "pointer"
            });
            $(this).css({
                "font-weight": "bold",
                "background-color": "#fafafa",
                "color": "#000",
                "cursor": "default"
            });
            that.setHoverStyle.apply(that);
            that.tags_Listener.apply(that);

            // 获得当前点击li的序号
            var index = $(".js_UploadImg_tags_li").index($(this));

            // 获得内容盒
            var content_ul = $(".js_UploadImg_content_ul");

            switch (index) {
                case 0: // 图片上传
                    content_ul.animate({
                        "left": "0px"
                    }, 300);

                    break;
                case 1: // 我的图库

                    // 获得图片上传内容盒
                    var content_li_0 = $(".js_UploadImg_content_li_0");

                    // 内容盒li的宽度
                    var content_li_width_px = content_li_0.width();

                    // 弹层盒
                    var _LayerShow = content_ul.parents("#info_wrapper");

                    // 内容盒高度
                    var content_height_px = _LayerShow.height() - that.TAG_HEIGHT_PX;

                    // 如第一次点击，则生成我的图库内容视图
                    if (!that.doms.content_li_1) {

                        // 创建我的图库内容盒
                        that.doms.content_li_1 = $(document.createElement("li"));

                        // 创建图片列表盒
                        that.doms.content_li_1_list = $(document.createElement("div"));
                    }

                    // 清空图片列表
                    that.doms.content_li_1_list.html("");

                    // 设置我的图库内容盒样式
                    that.doms.content_li_1
                        .addClass("js_UploadImg_content_li_1").css({
                            "height": content_height_px + "px",
                            "overflow": "scroll"
                        })
                        .appendTo(content_ul);

                    // 图片列表盒
                    that.doms.content_li_1_list
                        .addClass("js_UploadImg_content_li_1_list")
                        .appendTo(that.doms.content_li_1);

                    // 设置内容盒宽度
                    content_ul.css({
                        "width": content_li_width_px * 2 + "px",
                        "position": "absolute",
                        "top": "0",
                        "left": "0"
                    });

                    // 设置内容盒li的浮动
                    content_ul.find("li").css({
                        "float": "left",
                        "width": content_li_width_px + "px",
                        "list-style": "none"
                    });

                    // 设置内容外盒高度
                    content_ul.parent().css({
                        "height": content_height_px + "px"
                    });

                    // 获取瀑布流图片并装载
                    if (that.datalist)
                        that.setLibraryPics.apply(that, [that.datalist]);
                    else {
                        $.ajax({
                            url: that.opt.Library_ajaxUrl,
                            type: "get",
                            success: function(result) {
                                var datalist;
                                try {
                                    datalist = JSON.parse(result);
                                } catch (e) {
                                    datalist = [];
                                }
                                // console.log(datalist);
                                that.datalist = datalist;
                                that.setLibraryPics.apply(that, [that.datalist]);
                            }
                        });
                    }

                    // 移动内容盒，显示我的图库
                    content_ul.animate({
                        "left": -1 * content_li_width_px + "px"
                    }, 300);

                    break;
            }
        });
    },
    // 设置瀑布流
    // dataList: 项目单元内容。
    setLibraryPics: function(dataList) {
        var that = this;

        // console.log(dataList);

        var dataTemplate = "<div class=\"js_UploadImg_content_li_1_detail\" style=\"border:solid 1px #fff; cursor:pointer; padding:2px;\"><img src=\"{$data-imgPath}\" /><p style=\"margin:0;padding:0;text-align:center; line-height:20px;\">{$data-imgSummary}</p></div>";
        var WaterFall_para = {
            listener_scroll_selector: ".js_UploadImg_content_li_1", // 监听滚动的选择器。默认window，移动端使用mobile_stop_moved模块时，可以设置为最外盒
            box_selector: ".js_UploadImg_content_li_1_list", // 项目单元外盒选择器。无默认值。后自动设置行内元素样式 position: relative;
            item_selector: ".js_UploadImg_content_li_1_detail", // 项目单元选择器。必须存在于box内。无默认值
            item_width: that.opt.WaterFall_item_width, // 项目单元宽度。不包含列间距。无默认值
            line_top: that.opt.WaterFall_line_top, // 行 上间距。默认0
            line_first_top: that.opt.WaterFall_line_first_top, // 第一行 上间距。默认0
            column_left: that.opt.WaterFall_column_left, // 列 左间距。默认0
            column_first_left: that.opt.WaterFall_column_first_left, // 第一列 左间距。默认0
            unit: that.opt.WaterFall_unit, // 宽高单位 "px|vw", 默认px。且重置窗口大小时，vw不重新计算对应的px
            item_min: 1, // 最小列数，默认1。
            ps: 9999999, // 每页显示数量。默认50（5×10）
            data_template: dataTemplate, // 项目单元模板字符串。不传此参数，则项目单元直接装载datalist；传此参数，则datalist需要传入json对象，按键名替换模板中的{$data-key}。
            datalist: dataList, // 项目单元内容。支持字符串数组或JSON对象。JSON对象需配合data_template使用
            resize_window_resize_column_number: false, // 改变窗口大小时，重新计算列宽度（清空所有项目单元并重新加载，耗资源），默认false
            // callback_none_success: function() { // 0数据行成功回调（没有数据）。无默认值
            // }
            // callback_all_success: function() { // 第一次加载时，所有需要加载的图片加载成功回调。无默认值
            //     console.log("成功回调。无默认值");
            // }
            callback_item_success: function(_item_obj) { // 项目单元成功插入回调 _item_obj: 新插入的单元对象。无默认值
                if (_item_obj.hover) {
                    _item_obj.hover(function() {
                        $(this).css({
                            "border": "dashed 1px #999"
                        });
                    }, function() {
                        $(this).css({
                            "border": "solid 1px #fff"
                        });
                    });
                }
                _item_obj.unbind("click").on("click", function() {
                    if (that.opt.callback_upload)
                        that.opt.callback_upload($(this).find("img").attr("src"));
                    that.layershow.close();
                });
            }
        };

        // console.log(that.opt.WaterFall.paras);

        if (that.opt.WaterFall.paras) {
            that.opt.WaterFall.insert_items_list({
                datalist: dataList,
                clear_box: true // 是否清空已有项目单元
            });
        } else
            that.opt.WaterFall.init(WaterFall_para);
    },
    // 关闭弹层
    close: function() {
        var that = this;
        that.datalist = null;
    },
    // 执行报错回调
    // err: 报错信息
    errorExecFunc: function(err) {
        // console.log(err);
        var that = this;
        if (that.opt.callback_error)
            that.opt.callback_error(err);
    }
};

if (typeof define === "function" && define.amd) {
    define(function() {
        return js_UploadImg;
    });
}