/*
	白梦超
	20160718
	滑动图片验证码
	版本 v3.2.2
*/

//参数设置方法
/*
var t_opt = {
    pic_position: ".pic_code",//图片验证码外包层class或id，默认.pic_code
    div_width: 300,//设置显示的大图的宽，默认300
    valid_range: 5, // 图片验证正确的容错范围，默认是5,单位是px，不受unit影响
    unit: "px", // 宽高及容错范围单位 "px|vw", 默认px，且IE6/7/8强制使用px
    pic_mask: true,  //验证码大遮罩层，false-不显示遮罩层，true-显示遮罩层，默认true
    Pic_mask_color: "#000", //验证码大遮罩层颜色，默认黑色
    Pic_mask_opacity: 0.8, ////验证码大遮罩层透明度，默认0.8
    Pic_click_key: true, //开关，点击遮罩层验证码是否隐藏，true-隐藏，false-不隐藏，默认true
    Is_Cross_domain: false,//是否跨域 true-跨域（后端需配置跨域允许当前来源），false-不跨域，默认false
    Url_getPic: '/Pic_code/Pic_code.ashx', //获取图片地址的接口，跨域请填写带域名的地址，默认'/Pic_code/Pic_code.ashx'
    url_submit: '/Pic_code/Pic_code_valid.ashx', //验证地址，跨域请填写带域名的地址，默认'/Pic_code/Pic_code_valid.ashx'
    url_submit_para_extend : null,    //方法，返回提交验证时的参数扩展（json形式），默认null
                                    // return {
                                    //     handlerHost: http://www.abc.com, // 验证成功后发起后续接口请求的主机地址，有默认值，如使用默认值请不要传
                                    //     handlerPath: /Handler/abc.ashx, // 验证成功后发起后续接口请求的接口路径，有默认值，如使用默认值请不要传
                                    //     handlerType: Member, // 验证成功后发起后续接口请求的接口名，默认管理员，如使用默认值请不要传
                                    //     handlerAct: Select, // 验证成功后发起后续接口请求的方法名，默认登录，如使用默认值请不要传
                                    //     key1: value1, // 自定义键值对
                                    //     key2: value2,
                                    //     keyN: valueN 
                                    // };
    z_index: 800, //设置标签z_index，默认800
    position_default: true, //验证码是否居中显示，true-居中显示，false-自定义显示位置，默认true
    Callback_error: function () { // 验证失败回调，默认为滑块和拼图小块滑回原位pic_code.doMove();
        pic_code.doMove();
    },
    Callback_error_repeatedly: function () { // 多次验证失败回调，刷新验证码重新验证，优先于Callback_error  默认事件pic_code.change_background_url();
        pic_code.change_background_url();
    },
    Callback_error_repeatedly_count: 3, // 触发多次验证失败回调的失败次数，默认3
    Callback_success: function (data) { //验证成功回调，提示验证成功，默认方法：pic_code.valid_success_callback(), data接口返回信息
        pic_code.valid_success_callback();
    }
};
*/

var pic_code = {
    //获取dom元素
    dom_obj: {},
    //参数
    _opt: null,
    init: function (opt) {
        //设置默认参数
        var t_opt = {
            pic_position: ".pic_code",//图片验证码外包层class或id，默认.pic_code
            div_width: 300,//设置显示的大图的宽，默认300
            valid_range: 5, // 图片验证正确的容错范围，默认是5,单位是px，不受unit影响
            unit: "px", // 宽高及容错范围单位 "px|vw", 默认px，且IE6/7/8强制使用px
            pic_mask: true,  //验证码大遮罩层，false-不显示遮罩层，true-显示遮罩层，默认true
            Pic_mask_color: "#000", //验证码大遮罩层颜色，默认黑色
            Pic_mask_opacity: 0.8, ////验证码大遮罩层透明度，默认0.8
            Pic_click_key: true, //开关，点击遮罩层验证码是否隐藏，true-隐藏，false-不隐藏，默认true
            Is_Cross_domain: false,//是否跨域 true-跨域（后端需配置跨域允许当前来源），false-不跨域，默认false
            Url_getPic: '/Pic_code/Pic_code.ashx', //获取图片地址的接口，跨域请填写带域名的地址，默认'/Pic_code/Pic_code.ashx'
            url_submit: '/Pic_code/Pic_code_valid.ashx', //验证地址，跨域请填写带域名的地址，默认'/Pic_code/Pic_code_valid.ashx'
            url_submit_para_extend : null,    //方法，返回提交验证时的参数扩展（json形式），默认null
                                            // return {
                                            //     handlerHost: http://www.abc.com, // 验证成功后发起后续接口请求的主机地址，有默认值，如使用默认值请不要传
                                            //     handlerPath: /Handler/abc.ashx, // 验证成功后发起后续接口请求的接口路径，有默认值，如使用默认值请不要传
                                            //     handlerType: Member, // 验证成功后发起后续接口请求的接口名，默认管理员，如使用默认值请不要传
                                            //     handlerAct: Select, // 验证成功后发起后续接口请求的方法名，默认登录，如使用默认值请不要传
                                            //     key1: value1, // 自定义键值对
                                            //     key2: value2,
                                            //     keyN: valueN 
                                            // };
            z_index: 800, //设置标签z_index，默认800
            position_default: true, //验证码是否居中显示，true-居中显示，false-自定义显示位置，默认true
            Callback_error: function () { // 验证失败回调，默认为滑块和拼图小块滑回原位pic_code.doMove();
                pic_code.doMove();
            },
            Callback_error_repeatedly: function () { // 多次验证失败回调，刷新验证码重新验证，优先于Callback_error  默认事件pic_code.change_background_url();
                pic_code.change_background_url();
            },
            Callback_error_repeatedly_count: 3, // 触发多次验证失败回调的失败次数，默认3
            Callback_success: function (data) { //验证成功回调，提示验证成功，默认方法：pic_code.valid_success_callback(), data-接口返回信息
                pic_code.valid_success_callback();
            }
        };

        //初始化数据
        pic_code._opt = $.extend(t_opt, opt);
        //单位换换
        if (pic_code._opt.unit == 'vw'){
            pic_code._opt.div_width = pic_code._opt.div_width/100*$(window).width();
            pic_code._opt.unit = 'px';
        }
        //设置验证码初始的默认高度
        pic_code._opt.div_height = pic_code._opt.div_width;

        //创建dom
        pic_code.create_dom();

        //设置外包层宽
        $(pic_code._opt.pic_position).css({'width':pic_code._opt.div_width + pic_code._opt.unit,'z-index': pic_code._opt.z_index});
        pic_code.dom_obj = {
            oPicCode: $(pic_code._opt.pic_position)    //验证码最外面一层
        };
        //设置验证码默认显示位置
        if (pic_code._opt.position_default){
            //设置验证码的位置
            pic_code.dom_obj.oPicCode.css({'position':'fixed','top':'50%','left':'50%'});
            pic_code.dom_obj.oPicCode.css({'margin-top':-(pic_code._opt.div_height+50)/2,'margin-left':-pic_code._opt.div_width/2});
        }


        //点击弹层验证码消失
        $('#pic_code_mask').click(function () {
            pic_code.pic_code_hide();
        });

        //ie6,7,8,不支持vw，强制使用px
        if (pic_code.params.agent) {
            pic_code._opt.unit = 'px';
        }
        //设置样式
        pic_code.set_style();
    },

    //显示验证码方法
    open : function(opt){
        //合并参数
        if (opt) {
            pic_code._opt = $.extend(pic_code._opt, opt);
        }
        pic_code.pic_code_show();
        pic_code.refresh_pic();
        //监听 刷新验证码按钮 点击事件
        pic_code.oRef_click();
    },

    params: {
        left_begin: 8,	//设置小块初始位置距左侧的距离
        agent: window.navigator.userAgent.indexOf('MSIE 6.0') != -1 || window.navigator.userAgent.indexOf('MSIE 7.0') != -1 || window.navigator.userAgent.indexOf('MSIE 8.0') != -1  //浏览器是ie6,7,8此值为true，否则为false
    },

    //记录验证错误次数
    pic_code_error_count: { error: 0 },

    //创建DOM
    create_dom: function () {
        var _this = this;
        var outDiv = $(_this._opt.pic_position);
        //创建验证码背景层
        _this.pic_code_bg = $(document.createElement('div')).css({
            "position": "fixed",
            "top": 0,
            "left": 0,
            "width": "100vw",
            "height": "100vh",
            "background": pic_code._opt.Pic_mask_color,
            "opacity": pic_code._opt.Pic_mask_opacity,
            "filter": "alpha(opacity=" + (pic_code._opt.Pic_mask_opacity * 100) + ")",
            "display": "none",
            "z-index": pic_code._opt.z_index
        }).attr('id', 'pic_code_mask');
        outDiv.before(_this.pic_code_bg);

        //创建验证码盒子
        _this.pic_box = $(document.createElement('div')).css({
            "width": _this._opt.div_width + _this._opt.unit,
            "height": _this._opt.div_height + _this._opt.unit,
            "overflow": "hidden",
            "position": "relative",
            "z-index": pic_code._opt.z_index
        }).addClass('pic_box').appendTo(outDiv);

        //创建大图外包
        _this.big_pic = $(document.createElement('div')).css({
            "width": _this._opt.div_width + _this._opt.unit,
            "position": "relative",
            "z-index": pic_code._opt.z_index
        }).addClass('pic_bao').appendTo(_this.pic_box);

        //创建大图div
        _this.big_pic_img = $(document.createElement('div')).css({
            "width": _this._opt.div_width + _this._opt.unit,
            "height": _this._opt.div_height + _this._opt.unit,
            "z-index": pic_code._opt.z_index
        }).addClass('pic').html('<img src="" />').appendTo(_this.big_pic);

        //创建刷新按钮
        _this.pic_code_fresh = $(document.createElement('div')).css({
            "width": "60px",
            "height": "20px",
            "background": "#ddd",
            "line-height": "20px",
            "font-size": "12px",
            "text-align": "center",
            "cursor": "pointer",
            "color": "#666",
            "border-radius": "10px",
            "float": "right",
            "position": "relative",
            "top":"-20px",
            "z-index": pic_code._opt.z_index
        }).addClass('refresh').html("点击刷新").appendTo(outDiv);

        //创建滑块与轨道外包层
        _this.pic_code_liBao = $(document.createElement('div')).css({
            "width": _this._opt.div_width + _this._opt.unit,
            "height": "30px",
            "position": "relative",
            "float": "left",
            "z-index": pic_code._opt.z_index
        }).addClass('line_bao').appendTo(outDiv);

        //创建滑块轨道
        _this.pic_code_line = $(document.createElement('div')).css({
            "width": _this._opt.div_width + _this._opt.unit,
            "height": "30px",
            "background": "#ece4dd",
            "border-radius": "10px",
            "font-size": "12px",
            "color": "#666",
            "line-height": "30px",
            "text-indent": "60px",
            "overflow": "hidden",
            "z-index": pic_code._opt.z_index
        }).addClass('line').appendTo(_this.pic_code_liBao);

        //创建圆滑块
        _this.pic_code_circle = $(document.createElement('div')).css({
            "width": "40px",
            "height": "40px",
            "background": "#ccc",
            "border-radius": "50%",
            "position": "relative",
            "top": "-35px",
            "left": "0px",
            "cursor": "pointer",
            "z-index": pic_code._opt.z_index
        }).addClass('circle').appendTo(_this.pic_code_liBao);

        //创建成功提示信息
        _this.pic_success = $(document.createElement('div')).css({
            "width": _this._opt.div_width + _this._opt.unit,
            "height": "30px",
            "background": "#0da726",
            "border-radius": "10px",
            "font-size": "14px",
            "color": "#fff",
            "line-height": "30px",
            "letter-spacing": "6px",
            "text-align": "center",
            "margin-top": "20px",
            "display": "none",
            "z-index": pic_code._opt.z_index
        }).addClass('success').html('验证成功').appendTo(outDiv);

        //创建验证失败盒子
        _this.pic_fail_box = $(document.createElement("div")).css({
            "width": _this._opt.div_width + _this._opt.unit,
            "height": "30px",
            "overflow": "hidden",
            "position": "relative",
            "z-index": pic_code._opt.z_index
        }).addClass('pic_fail_box').appendTo(_this.pic_box);

        //创建提示信息遮罩层
        _this.pic_success_mask = $(document.createElement('div')).css({
            "width": _this._opt.div_width + _this._opt.unit,
            "height": "30px",
            "background": "#fff",
            "opacity": "0.6",
            "filter": "alpha(opacity=60)",
            "position": "relative",
            "font-size": "60px",
            "line-height": "160px",
            "text-align": "center",
            "font-weight": "bold",
            "z-index": pic_code._opt.z_index
        }).addClass('pic_code_mask').appendTo(_this.pic_fail_box);

        //创建失败提示信息
        _this.pic_fail = $(document.createElement('div')).css({
            "width": _this._opt.div_width + _this._opt.unit,
            "height": "30px",
            "position": "absolute",
            "top": 0,
            "left": 0,
            "font-size": "14px",
            "line-height": "30px",
            "text-indent": "14px",
            "color": "#000",
            "font-weight": "normal",
            "text-align": "left",
            "z-index": pic_code._opt.z_index
        }).addClass('pic_code_content').html('<span style="color:#ff0000">验证失败</span> : 拖动滑块，完成正确拼图').appendTo(_this.pic_fail_box);

        //创建loading
        _this.loading = $(document.createElement('div')).css({
            "display":'block',
            "width": _this._opt.div_width + _this._opt.unit,
            "height": _this._opt.div_height + _this._opt.unit,
            "text-align":"center",
            "line-height": _this._opt.div_height + _this._opt.unit,
            "font-size": "16px",
            "color": "#fff",
            "position":"absolute",
            "top":"0",
            "left":"0",
            "background":"#000",
            "border":"2px solid #ccc",
            "z-index": (pic_code._opt.z_index+1)
            }).html('验证码生成中，请稍候');
        _this.loading.appendTo(_this.pic_box);
    },

    //设置样式
    set_style: function () {
        var company = pic_code._opt.unit;
        pic_code.dom_obj.oPicCode.css('width', pic_code._opt.div_width + company);
        pic_code.big_pic.css('width', pic_code._opt.div_width + company);
        pic_code.pic_code_line.css('width', pic_code._opt.div_width + company);
        pic_code.pic_success.css('width', pic_code._opt.div_width + company);
        pic_code.big_pic_img.css({ 'width': pic_code._opt.div_width + company, 'height': pic_code._opt.div_height + company });
        pic_code.pic_success_mask.css({ 'width': pic_code._opt.div_width + company });
        //设置验证码盒子高度
        pic_code.pic_box.css('height',pic_code._opt.div_height);
        //设置大图div高
        pic_code.big_pic_img.css('height',pic_code._opt.div_height);
        //设置loaning高度
        pic_code.loading.css({'height':pic_code._opt.div_height,'line-height':pic_code._opt.div_height + pic_code._opt.unit});
    },

    // 换大图
    change_background_url: function () {
        //显示滑块
        pic_code.pic_code_circle.css({ 'left': '-5px','display':'block' });
        //显示刷新按钮
        pic_code.pic_code_fresh.css('visibility', 'visible');
        //取消滑块滑动事件
        pic_code.Cancle_oCircle_Click();
        clearTimeout(pic_code.timer);
        pic_code.pic_fail_box.animate({ 'top': '0px' }, 100);

        pic_code.pic_code_error_count.error = 0;
        pic_code.pic_code_circle.css('left', '-5px');
        pic_code.pic_code_line.css({"text-indent": "60px","text-align":"left"}).html('按住左边滑块，拖动完成上方拼图');
        pic_code.delateDiv();
        pic_code.loading.css('display', 'block');
        if (pic_code._opt.Is_Cross_domain) {
            $.ajax({
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                url: pic_code._opt.Url_getPic,
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                type: 'post',
                data: {

                },
                success: function (data) {

                    if (!data.error){
                        data = $.parseJSON(data);
                    }
                    if (data.error == 'success' || data.error == 'SUCCESS') {
                        //小图路径
                        pic_code._opt.img1 = data.img2;
                        //大图路径
                        pic_code._opt.img2 = data.img1;
                        pic_code.big_pic_img.find('img').attr('src', data.img2);
                        pic_code.big_pic_img.find('img').css('width', '100%');
                        //小图的宽
                        pic_code._opt.pic_small_width = data.water_width;
                        //小图的高
                        pic_code._opt.pic_small_height = data.water_height;
                        //原始图片的宽
                        pic_code._opt.pic_original_width = data.original_width;
                        //原始图片的高
                        pic_code._opt.pic_original_height = data.original_height;
                        //计算原图与显示图的比例
                        pic_code._opt.Proportion = pic_code._opt.pic_original_width/pic_code._opt.div_width;
                        //水印图片距顶部距离
                        pic_code._opt.Y = data.Y / pic_code._opt.Proportion;
                        //计算显示图片的高
                        pic_code._opt.div_height = pic_code._opt.pic_original_height/pic_code._opt.Proportion;
                        //设置验证码默认显示位置
                        if (pic_code._opt.position_default){
                            //设置验证码的位置
                            pic_code.dom_obj.oPicCode.css({'position':'fixed','top':'50%','left':'50%'});
                            pic_code.dom_obj.oPicCode.css({'margin-top':-(pic_code._opt.div_height+50)/2,'margin-left':-pic_code._opt.div_width/2});
                        }

                        //设置样式
                        pic_code.set_style();


                        var oImg_1 = new Image();
                        oImg_1.src=data.img2;

                        var oImg_2 = new Image();
                        oImg_2.src=data.img1;

                        var num = 0;
                        var complete = function(){

                            pic_code.delateDiv();
                            pic_code.create_div();
                            pic_code.oCircle_Click();
                            pic_code.loading.css('display', 'none');
                            // 监听 刷新验证码按钮 点击事件
                            pic_code.oRef_click();
                        };
                        oImg_1.onload = function(){
                            num++;
                            if(num>=2){
                                complete();
                            }

                        };
                        oImg_2.onload = function(){
                            num++;
                            if(num>=2){
                                complete();
                            }
                        };
                    }
                }
            });
        }
        else {
            $.ajax({
                url: pic_code._opt.Url_getPic,
                type: 'post',
                data: {

                },
                success: function (data) {
                    //console.log(data);
                    if (!data.error){
                        data = $.parseJSON(data);
                    }
                    if (data.error == 'success' || data.error == 'SUCCESS') {
                        //小图路径
                        pic_code._opt.img1 = data.img2;
                        //大图路径
                        pic_code._opt.img2 = data.img1;
                        pic_code.big_pic_img.find('img').attr('src', data.img2);
                        pic_code.big_pic_img.find('img').css('width', '100%');
                        //小图的宽
                        pic_code._opt.pic_small_width = data.water_width;
                        //小图的高
                        pic_code._opt.pic_small_height = data.water_height;
                        //原始图片的宽
                        pic_code._opt.pic_original_width = data.original_width;
                        //原始图片的高
                        pic_code._opt.pic_original_height = data.original_height;
                        //计算原图与显示图的比例
                        pic_code._opt.Proportion = pic_code._opt.pic_original_width/pic_code._opt.div_width;
                        //水印图片距顶部距离
                        pic_code._opt.Y = data.Y / pic_code._opt.Proportion;
                        //计算显示图片的高
                        pic_code._opt.div_height = pic_code._opt.pic_original_height/pic_code._opt.Proportion;
                        //设置验证码默认显示位置
                        if (pic_code._opt.position_default){
                            //设置验证码的位置
                            pic_code.dom_obj.oPicCode.css({'position':'fixed','top':'50%','left':'50%'});
                            pic_code.dom_obj.oPicCode.css({'margin-top':-(pic_code._opt.div_height+50)/2,'margin-left':-pic_code._opt.div_width/2});
                        }
                        //设置样式
                        pic_code.set_style();

                        var oImg_1 = new Image();
                        oImg_1.src=data.img2;

                        var oImg_2 = new Image();
                        oImg_2.src=data.img1;

                        var num = 0;
                        var complete = function(){

                            pic_code.delateDiv();
                            pic_code.create_div();
                            pic_code.oCircle_Click();
                            pic_code.loading.css('display', 'none');
                            // 监听 刷新验证码按钮 点击事件
                            pic_code.oRef_click();
                        };
                        oImg_1.onload = function(){
                            num++;
                            if(num>=2){
                                complete();
                            }

                        };
                        oImg_2.onload = function(){
                            num++;
                            if(num>=2){
                                complete();
                            }
                        };

                    }
                }
            });
        }

    },

    //验证失败小块滑回原位
    doMove: function () {
        //取消滑块滑动事件
        pic_code.Cancle_oCircle_Click();
        //隐藏刷新按钮
        pic_code.pic_code_fresh.css('visibility', 'hidden');
        if (pic_code.pic_code_error_count.error < pic_code._opt.Callback_error_repeatedly_count) {
            pic_code.pic_fail.html('<span style="color:#ff0000">验证失败</span> : 拖动滑块，完成正确拼图');
        } else {
            pic_code.pic_fail.html('<span style="color:#ff0000">验证次数过多</span> : 系统将自动刷新验证码');
        }
        pic_code.pic_fail_box.animate({ 'top': '-30px' }, 100);
        clearTimeout(pic_code.timer);
        pic_code.timer = setTimeout(function () {
            pic_code.pic_fail_box.animate({ 'top': '0px' }, 100);
            //显示刷新按钮
            pic_code.pic_code_fresh.css('visibility', 'visible');
        }, 1000);
        pic_code.pic_code_circle.css({ 'left': '-5px','display':'block' });
        //pic_code.pic_code_circle.animate({ 'left': '-5px' }, 300);
        $('.pic_code .pic_bao div').eq(1).animate({ 'left': pic_code.params.left_begin + 'px' }, 300);
        pic_code.pic_code_line.css({"text-indent": "60px","text-align":"left"}).html('按住左边滑块，拖动完成上方拼图');
        setTimeout(function () {

            pic_code.oCircle_Click();
            // 监听 刷新验证码按钮 点击事件
            pic_code.oRef_click();

        }, 300);
    },

    //验证成功的默认回调
    valid_success_callback: function () {
        pic_code.pic_success.css('display', 'block');
        pic_code.pic_code_liBao.css('display', 'none');
        pic_code.pic_code_fresh.css('display', 'none');
        pic_code.big_pic.unbind('click');
        pic_code.pic_code_fresh.unbind('click');
    },

    // 监听 滑块点击和拖动
    oCircle_Click: function () {
        pic_code.pic_code_circle.on('mousedown touchstart', function (event) {
            //隐藏刷新按钮
            pic_code.pic_code_fresh.css('visibility', 'hidden');
            //获取小滑块
            var oDiv1 = $('.pic_code .pic_bao div').eq(1);
            //var oDiv2=$('.pic_code .pic_bao div').eq(3);
            var oD_left = parseInt(oDiv1.offset().left);
            var disX = 0;
            if (event.originalEvent) {
                disX = event.clientX - parseInt(oDiv1.css('left')) || event.originalEvent.targetTouches[0].pageX - parseInt(oDiv1.css('left'));
            } else {
                disX = event.clientX - parseInt(oDiv1.css('left')) || event.targetTouches[0].pageX - parseInt(oDiv1.css('left'));
            }
            //圆滑块的最大left值
            var oL_max_px = parseInt(pic_code.pic_code_line.width()) - parseInt(pic_code.pic_code_circle.width());
            //可动的小块的最大leftzhi
            var oDiv1_left_max_px = parseInt(pic_code.big_pic_img.width()) - parseInt(oDiv1.width()) - pic_code.params.left_begin - 8;

            $(document).unbind('mousemove touchmove');
            $(document).unbind('mouseup touchend');

            $(document).on('mousemove touchmove', function (event) {
                //隐藏刷新按钮
                pic_code.pic_code_fresh.css('visibility', 'hidden');
                var oL = 0;
                if (event.originalEvent) {
                    oL = event.clientX - disX || event.originalEvent.targetTouches[0].pageX - disX;
                } else {
                    oL = event.clientX - disX || event.targetTouches[0].pageX - disX;
                }

                if (oL >= 10) {
                    pic_code.pic_code_line.html('');
                } else {
                    pic_code.pic_code_line.css({"text-indent": "60px","text-align":"left"}).html('按住左边滑块，拖动完成上方拼图');
                }

                if (oL <= 0) {
                    oL = 0;
                } else if (oL >= oL_max_px) {
                    oL = oL_max_px;
                }

                pic_code.pic_code_circle.css('left', oL + 'px');

                oDiv1.css('left', (oL / oL_max_px * oDiv1_left_max_px + pic_code.params.left_begin) + 'px');
            });

            $(document).on('mouseup touchend', function () {
                var dix_long = parseInt(parseInt(oDiv1.css('left'))*pic_code._opt.Proportion);
                pic_code.pic_code_line.css({"text-indent": "0px","text-align":"center"}).html('验证中，请稍候');
                // 取消 刷新验证码按钮 点击事件
                pic_code.Cancle_oRef_click();
                //取消滑块的点击事件
                pic_code.Cancle_oCircle_Click();
                //滑块消失
                pic_code.pic_code_circle.css('display', 'none');
                var json = {};
                var json_l = {};
                if (pic_code._opt.Is_Cross_domain) {
                    json = {
                        dix_long: dix_long,
                        valid_range: pic_code._opt.valid_range
                    }
                    if(pic_code._opt.url_submit_para_extend !== null){
                        json_l = pic_code._opt.url_submit_para_extend();
                        json = $.extend(json, json_l);
                    }
                    $.ajax({
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        url: pic_code._opt.url_submit,
                        xhrFields: {
                            withCredentials: true
                        },
                        crossDomain: true,
                        type: 'POST',
                        data: json,
                        success: function (data) {
                            if (!data.error){
                                data = $.parseJSON(data);
                            }
                            //验证成功的操作
                            if (data.error == 'success' || data.error == 'SUCCESS') {
                                pic_code._opt.Callback_success(data);
                                //验证失败的操作
                            } else {
                                pic_code.pic_code_error_count.error += 1;
                                pic_code.pic_code_circle.unbind('mousedown touchstart');
                                if (pic_code.pic_code_error_count.error >= pic_code._opt.Callback_error_repeatedly_count) {
                                    pic_code._opt.Callback_error();
                                    setTimeout(function () {
                                        pic_code._opt.Callback_error_repeatedly();
                                    }, 500);
                                } else {
                                    pic_code._opt.Callback_error();
                                }

                            }
                        }
                    });
                } else {
                    json = {
                        dix_long: dix_long,
                        valid_range: pic_code._opt.valid_range
                    }
                    if(pic_code._opt.url_submit_para_extend !== null){
                        json_l = pic_code._opt.url_submit_para_extend();
                        json = $.extend(json, json_l);
                    }
                    $.ajax({
                        url: pic_code._opt.url_submit,
                        type: 'POST',
                        data: json,
                        success: function (data) {
                            if (!data.error){
                                data = $.parseJSON(data);
                            }

                            //验证成功的操作
                            if (data.error == 'success' || data.error == 'SUCCESS') {
                                pic_code._opt.Callback_success(data);
                                //验证失败的操作
                            } else {
                                pic_code.pic_code_error_count.error += 1;
                                pic_code.pic_code_circle.unbind('mousedown touchstart');
                                if (pic_code.pic_code_error_count.error >= pic_code._opt.Callback_error_repeatedly_count) {
                                    pic_code._opt.Callback_error();
                                    setTimeout(function () {
                                        pic_code._opt.Callback_error_repeatedly();
                                    }, 500);
                                } else {
                                    pic_code._opt.Callback_error();
                                }

                            }
                        }
                    });
                }

                $(document).unbind('mousemove touchmove');
                $(document).unbind('mouseup touchend');
            });
            return false;
        });
    },

    //取消滑块的点击事件
    Cancle_oCircle_Click : function(){
        pic_code.pic_code_circle.off('mousedown touchstart');
    },

    // 监听 刷新验证码按钮 点击事件
    oRef_click: function () {
        // 取消 刷新验证码按钮 点击事件
        pic_code.Cancle_oRef_click();

        pic_code.pic_code_fresh.on('click',function () {
            pic_code.refresh_pic();
        });
        pic_code.big_pic.on('click',function () {
            pic_code.refresh_pic();
        });
    },
    // 取消 刷新验证码按钮 点击事件
    Cancle_oRef_click : function(){
        pic_code.pic_code_fresh.off('click');
        pic_code.big_pic.off('click');
    },
    //刷新验证码
    refresh_pic: function () {
        // 取消 刷新验证码按钮 点击事件
        pic_code.Cancle_oRef_click();
        pic_code.pic_success.css('display', 'none');
        pic_code.pic_code_liBao.css('display', 'block');
        pic_code.pic_code_fresh.css('display', 'block');
        pic_code.delateDiv();
        pic_code.change_background_url();
    },

    // 创建小块
    create_div: function () {
        var oDiv1 = $('<div></div>');
        oDiv1.appendTo(pic_code.big_pic);
        console.log(pic_code._opt.pic_small_width/pic_code._opt.Proportion)
        oDiv1.css({ 'width': pic_code._opt.pic_small_width/pic_code._opt.Proportion, 'height': pic_code._opt.pic_small_height/pic_code._opt.Proportion, 'position': 'absolute', 'left': pic_code.params.left_begin + 'px', 'top': pic_code._opt.Y + 'px', 'overflow': 'hidden', 'box-shadow': '0px 0px 3px 3px yellow inset,0px 0px 3px 3px yellow' });
        oDiv1.html('<img src=' + pic_code._opt.img2 + ' style="width: 100%">');
    },

    // 删除小块
    delateDiv: function () {
        var len = $('.pic_code .pic_bao div').length;
        for (var i = len; i >= 1; i--) {
            $('.pic_code .pic_bao div').eq(i).remove();
        }
    },
    //显示验证码弹层
    pic_code_show: function () {
        $(pic_code._opt.pic_position).css('display', 'block');
        if (pic_code._opt.pic_mask) {
            $('#pic_code_mask').css('display', 'block');
        }
    },
    //隐藏验证码弹层
    pic_code_hide: function () {
        $(pic_code._opt.pic_position).css('display', 'none');
        $('#pic_code_mask').css('display', 'none');
    },
};


if (typeof define === "function" && define.amd) {
    define([], function () {
        return pic_code;
    });
}

//返回一个m到n之间的随机数
function rnd(m, n) {
    return parseInt(Math.random() * (m - n) + n);
}


