# ImageMarkPen 图片标记插件 v0.1.1
### 安装：npm install topunet-imagemarkpen
=============

文件结构：
-------------

        1. jq/baidu_map.js 放入项目文件夹jq（原生规范）或widget/lib（AMD规范）中
        2. demo中的demo.html为功能展现最全面的页面；demo_requireJs.html是amd规范的测试；demo_mobile.html是移动端测试

页面引用：
-------------
原生引用

        1. 页面底端引用 https://api.map.baidu.com/api?v=2.0&ak=xxxxx（xxxxx需要去百度开放平台去注册申请）
        2. 后引用 https://api.map.baidu.com/library/SearchInfoWindow/1.5/src/SearchInfoWindow_min.js
        3. 后引用最新版 /inc/Jquery.min.js#1.x.x 或 zepto.min.js
        4. 后引用 /jq/baidu_map.js

requireJS引用

        1. 页面底端引用require.js前，引用 https://api.map.baidu.com/api?v=2.0&ak=xxxxx（xxxxx需要去百度开放平台去注册申请）
        2. 后引用 https://api.map.baidu.com/library/SearchInfoWindow/1.5/src/SearchInfoWindow_min.js
        3. 依赖baidu_map.js和jquery.min.js#1.x 或 zepto.min.js，成功后返回对象baidu_map

功能配置及启用：
--------------
1. 调用方法：


兼容性：
-------------

        ie7、8：

            不支持弹层内显示地图————应该是百度提供的api在获取标签时有问题。
            地图底图建筑物点击弹层，原始样式有问题


更新日志：
-------------
v0.1.1

        * 

