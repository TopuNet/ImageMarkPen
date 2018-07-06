// v3.5.1
/*
    that:{
        opt_init: init方法接收的参数,
        map_obj: map对象
    }
*/
function baidu_map() {
    return {
        // 初始化，一个地图盒只调用一次
        init: function(opt) {
            var that = this;

            var opt_default = {
                map_obj_id: null, // 地图容器ID。无默认值。
                scroll_obj_selector: null, // overflow为scroll的外盒选择器。
                /* 当地图容器存在于一个overflow为scroll的外盒中时，
                需开启入场后再加载地图功能，以防止气泡不显示。*/
                enableScrollWheelZoom: true, // 允许滚轮缩放。默认值：true
                NavigationControl: true, // 左上角缩放尺。默认值：true
                ScaleControl: false, // 左下角比例尺。默认值：false
                OverviewMapControl: true, // 右下角小地图：true
                CurrentCity: "北京", // 当前城市。默认值：北京
                MapTypeControl: true, // 右上角地图种类，仅当设置当前城市后可用。默认值：true
                MapClickEnable: true, // 底图可点
                FontStyle: "font-size: 12px;" // 文字样式。默认值：font-size:12px;
            };
            that.opt_init = $.extend(opt_default, opt);

            // 创建map对象
            that.createMap.apply(that);

            // 设置地图属性
            that.setMapAttr.apply(that);

            // 设置文字样式
            that.setFontStyle.apply(that);
        },
        // 创建map对象
        createMap: function() {
            var that = this;

            that.map_obj = new BMap.Map(that.opt_init.map_obj_id, { enableMapClick: that.opt_init.MapClickEnable }); // 创建地图实例 

            // 重写样式
            $("div.BMap_bubble_content span,div.BMap_bubble_content a").css("font-size", "12px!important");
            $("div.BMap_bubble_content span img").css("display", "inline!important");

            that.map_obj.centerAndZoom(new BMap.Point(116.404, 39.915), 1);
        },
        // 设置地图属性
        setMapAttr: function(opt) {
            var that = this;

            if (that.opt_init.enableScrollWheelZoom)
                that.map_obj.enableScrollWheelZoom(); // 允许滚轮缩放
            if (that.opt_init.NavigationControl)
                that.map_obj.addControl(new BMap.NavigationControl()); // 左上角缩放尺
            if (that.opt_init.ScaleControl)
                that.map_obj.addControl(new BMap.ScaleControl()); // 左下角比例尺
            if (that.opt_init.OverviewMapControl)
                that.map_obj.addControl(new BMap.OverviewMapControl()); // 右下角小地图
            if (that.opt_init.MapTypeControl)
                that.map_obj.addControl(new BMap.MapTypeControl()); // 右上角地图种类
            if (that.opt_init.CurrentCity)
                that.map_obj.setCurrentCity(that.opt_init.CurrentCity); // 仅当设置城市信息时，MapTypeControl的切换功能才能可用
        },
        // 根据参数决定直接执行方法 或 监听滚动，在确定地图入场后再执行方法。callback为要执行的方法
        PrepareDoAction: function(callback) {
            var that = this;

            if (!that.opt_init.scroll_obj_selector) {
                callback();
            } else {

                var map_box = $("#" + that.opt_init.map_obj_id);
                var wrapper_box = $(that.opt_init.scroll_obj_selector);

                var map_top_px = map_box.position().top; // 地图盒初始top
                var map_height_px = map_box.height(); // 地图盒高度
                var wrapper_height_px = wrapper_box.height(); // scroll盒高度

                // mobile_stop_moved模块有重置scroll盒高度功能，so…首次赋值，比较盒高度和窗口高度，取小值
                var window_height_px = $(window).height();
                wrapper_height_px = wrapper_height_px < window_height_px ? wrapper_height_px : window_height_px;

                var scrollTop_px; // 已滚动距离
                var listenScroll = true; // 监听scroll，显示地图后，不再监听

                // 测试地图盒是否已入场
                var test = function() {
                    scrollTop_px = wrapper_box.scrollTop();

                    // console.log(map_top_px + ":" + scrollTop_px + ":" + wrapper_height_px);
                    if (map_top_px - scrollTop_px < wrapper_height_px - map_height_px / 2) { // 减去地图盒高度的一半是为了兼容安卓微信浏览器。等于地图盒入场一半高度时，才会加载地图
                        callback();
                        listenScroll = false;
                    }
                };

                // 监听scroll盒滚动
                wrapper_box.scroll(function() {
                    if (!listenScroll)
                        return;
                    wrapper_height_px = wrapper_box.height();
                    test();
                });

                // 打开页面时，先执行一次测试。如果地图盒在可视范围内，则直接显示。
                test();
            }
        },
        // 定位（获得当前坐标）
        // @callback:function(point{lat,lng}){}
        getCurrentPos: function(callback) {

            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function(r) {
                if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                    if (callback)
                        callback(r.point);
                } else {
                    console.log('baiduMap: ' + this.getStatus());
                }
            });
        },
        // 打开百度/高德APP进行导航
        /*
            opt = {
                app: 0, // 1-ios百度地图 2-android百度地图 3-ios高德地图 4-android高德地图
                mode: "driving", // app=1/2时有效 transit-公交 | driving-驾车(默认) | walking-步行
                origin_city: "北京", // app=1/2时有效 出发城市，默认"北京"
                origin_pos: { // app=1/2时有效 出发位置坐标，可以用getCurrentPos()获得当前坐标
                    lat: 0,
                    lng: 0
                },
                origin_title: "我的位置", // app=1/2时有效 出发位置名称，默认"我的位置"
                destination_city: "北京", // app=1/2时有效 目的城市，默认"北京"
                destination_pos: { // 目的位置坐标，可以用marker.point
                    lat: 0,
                    lng: 0
                },
                destination_title:"", // app=1/2时有效 目的位置名称，无默认值
                callback_gotoStore: function(store_uri){} // 返回商城链接的回调，在跳转至app前执行
            }
        */
        locationToNavigator: function(opt) {
            var opt_default = {
                app: 0,
                mode: "driving",
                origin_city: "",
                origin_pos: {
                    lat: 0,
                    lng: 0
                },
                origin_title: "我的位置",
                destination_city: "北京",
                destination_pos: {
                    lat: 0,
                    lng: 0
                },
                destination_title: ""
            };
            opt = $.extend(opt_default, opt);
            var schema,
                store_uri,
                app_source = "TopuMap";
            switch (opt.app.toString()) {
                case "1":
                    schema = "baidumap";
                    store_uri = "https://itunes.apple.com/cn/app/%E7%99%BE%E5%BA%A6%E5%9C%B0%E5%9B%BE-%E5%87%BA%E8%A1%8C%E5%AF%BC%E8%88%AA%E5%BF%85%E5%A4%87%E7%9A%84%E6%99%BA%E8%83%BD%E8%B7%AF%E7%BA%BF%E8%A7%84%E5%88%92%E8%BD%AF%E4%BB%B6/id452186370?mt=8";
                    break;
                case "2":
                    schema = "bdapp";
                    store_uri = "http://sj.qq.com/myapp/detail.htm?apkName=com.baidu.BaiduMap";
                    break;
                case "3":
                    schema = "iosamap";
                    store_uri = "https://itunes.apple.com/cn/app/%E9%AB%98%E5%BE%B7%E5%9C%B0%E5%9B%BE-%E7%B2%BE%E5%87%86%E5%9C%B0%E5%9B%BE-%E5%AF%BC%E8%88%AA%E5%BF%85%E5%A4%87-%E6%99%BA%E8%83%BD%E4%BA%A4%E9%80%9A%E5%AF%BC%E8%88%AA%E5%9C%B0%E5%9B%BE/id461703208?mt=8";
                    break;
                case "4":
                    schema = "androidamap";
                    store_uri = "http://sj.qq.com/myapp/detail.htm?apkName=com.autonavi.minimap";
                    break;
                default:
                    schema = "";
                    store_uri = "";
                    break;
            }

            if (schema === "")
                console.log("baidu_map 166:", "请传入opt.app: 1-ios 2-android");
            else {
                var uri = schema;

                switch (opt.app.toString()) {
                    case "1":
                    case "2":
                        uri += "://map/direction?";
                        uri += "origin=latlng:" + opt.origin_pos.lat + "," + opt.origin_pos.lng + "|name:" + opt.origin_title;
                        // uri += "origin=latlng:39.92259415755889,116.41650639906512|name:" + opt.origin_title;
                        // uri += "&destination=" + opt.destination_title;
                        uri += "&destination=latlng:" + opt.destination_pos.lat + "," + opt.destination_pos.lng;
                        if (opt.destination_title !== "")
                            uri += "|name:" + opt.destination_title;
                        uri += "&mode=" + opt.mode;
                        uri += "&origin_city=" + opt.origin_city;
                        uri += "&destination_city=" + opt.destination_city;
                        uri += "&src=" + app_source;
                        break;
                    case "3":
                    case "4":
                        uri += "://navi?sourceApplication=" + app_source;
                        uri += "&lat=" + opt.destination_pos.lat + "&lon=" + opt.destination_pos.lng;
                        uri += "&dev=0&style=1";
                        break;
                    default:
                        break;
                }

                if (opt.callback_gotoStore)
                    opt.callback_gotoStore(store_uri);

                // alert(uri);

                // document.write(uri);

                location.href = uri;
            }
        },
        // 获得两点距离，单位为m或km
        // @point_a,point_b:{lat,lng}
        getDistance: function(point_a, point_b) {
            var distance = parseInt(BMapLib.GeoUtils.getDistance(point_a, point_b));

            if (distance > 1000)
                distance = (parseInt(distance / 10) / 100) + "km";
            else
                distance = distance.toString() + "m";

            return distance;
        },
        // 增加定点标注
        PointMarker: function(opt) {
            var that = this;

            var opt_default = {
                clearOld: true, // 清除原有marker
                Zoom: 14,
                Points: [{
                    Keywords: "北京天安门",
                    Bounce: true,
                    click_callback: null
                }]
            };

            opt = $.extend(opt_default, opt);

            if (opt.clearOld)
                that.map_obj.clearOverlays();

            var marking = function() {

                // 创建地址解析器实例
                var myGeo = new BMap.Geocoder();

                var makingPoints = function(_i) {

                    if (_i >= opt.Points.length) {
                        return;
                    }

                    // 将地址解析结果显示在地图上,并调整地图视野
                    myGeo.getPoint(opt.Points[_i].Keywords, function(point) {

                        if (point === null) {
                            console.log("baidu_map", "135", "地点未找到: ", opt.Points[_i].Keywords);
                            opt.Points[_i].Keywords = "北京天安门";
                            makingPoints(_i);
                        } else {
                            var marker = new BMap.Marker(point); // 创建标注   

                            if (opt.Points[_i].click_callback)
                                marker.addEventListener("click", function(e) {
                                    // console.dir(point,marker);
                                    opt.Points[_i].click_callback(marker);
                                });

                            that.map_obj.addOverlay(marker);

                            if (opt.Points[_i].Bounce)
                                marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画 

                            if (opt.Points[_i].Label) {
                                var label = new BMap.Label(opt.Points[_i].Label, { offset: new BMap.Size(20, -10) });
                                marker.setLabel(label);
                            }

                            if (_i === 0)
                                that.map_obj.centerAndZoom(point, opt.Zoom);

                            makingPoints(_i + 1);
                        }
                    }, opt.CurrentCity);

                };

                makingPoints(0);
            };

            that.PrepareDoAction.apply(that, [marking]);
        },
        PointMarkerInfo: function(opt) {
            var that = this;

            var opt_default = {
                marker: null,
                content: null // 内容，支持html标签
            };

            var para_default = {
                title: "北京天安门", //标题
                width: 300, //宽度
                height: 50, //content高度
                panel: "panel", //检索结果面板
                enableAutoPan: true, //自动平移
                searchTypes: [
                    BMAPLIB_TAB_SEARCH, //周边检索
                    BMAPLIB_TAB_TO_HERE, //到这里去
                    BMAPLIB_TAB_FROM_HERE //从这里出发
                ]
            };

            opt = $.extend(opt_default, opt);
            opt.para = $.extend(para_default, opt.para);

            if (!that.map_obj || opt.marker === null)
                return;

            var searchInfoWindow = null;
            searchInfoWindow = new BMapLib.SearchInfoWindow(that.map_obj, opt.content, opt.para);

            searchInfoWindow.open(opt.marker);
        },
        // 关键词搜索，增加搜索结果
        Search: function(opt) {
            var that = this;

            var opt_default = {
                SearchKeywords: "北京天安门"
            };

            opt = $.extend(opt_default, opt);

            var searching = function() {

                var local = new BMap.LocalSearch(that.map_obj, {
                    renderOptions: { map: that.map_obj }
                });
                local.search(opt.SearchKeywords);
            };

            that.PrepareDoAction.apply(that, [searching]);
        },
        // 设置文字样式
        setFontStyle: function() {
            var that = this;
            var style_obj = document.getElementById("baidu_map_style");
            if (style_obj)
                return;
            style_obj = document.createElement("div");
            style_obj.innerHTML = "<style id=\"baidu_map_style\">.BMapLib_SearchInfoWindow *,.tangram-suggestion-main *{" + that.opt_init.FontStyle + "}</style>";
            document.getElementsByTagName("head")[0].appendChild(style_obj.lastChild);
        },
        // 【异步】百度转高德坐标api
        // ***注意*** 有配额限制，不要像demo一样每次点击调用。
        /*
            @opt = {
                key, // 去高德官方注册开发者，创建key（选择坐标转换）
                lat,lng,
                callback(coord) // 成功回调。接口返回错误时，console.log错误并不执行回调。@coord为数组[lng,lat] 对，我没有写反。
            }
        */
        coord_Baidu2Amap: function(opt) {
            $.ajax({
                url: "http://restapi.amap.com/v3/assistant/coordinate/convert",
                type: "get",
                data: {
                    key: opt.key,
                    locations: opt.lng + "," + opt.lat,
                    coordsys: "baidu",
                },
                success: function(result) {
                    // console.log(result);
                    if (result.status != "1")
                        console.log(result);
                    else if (opt.callback)
                        opt.callback(result.locations.split(','));
                }
            });
        }
    };
}

(function(path) {
    var a = document.createElement("link");
    a.type = "text/css";
    a.rel = "stylesheet";
    a.href = path;
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(a);
})("https://api.map.baidu.com/library/SearchInfoWindow/1.5/src/SearchInfoWindow_min.css");

if (typeof define === "function" && define.amd) {
    define(function() {
        return baidu_map;
    });
}