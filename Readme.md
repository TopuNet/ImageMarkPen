# ImageMarkPen 图片标记插件 v0.3.1
=============

更新日志：
-------------
v0.3.2(2018-07-05)

		* 引入babel
		* close()中重置style.width和height，解决window.devicePixelRatio==1时，style.width/height没有被重置的bug
		* 解决button_char改为svg图片后，resetStyle被遗漏的bug
		* 引入jquery-ui，用resizable方法解决ie全系不支持css.resize的问题（除ie外依旧使用原生css）
		* 解决text被undo时y坐标自加的bug

v0.3.1(2018-07-04)

		* 拖拽好了

v0.2.1(2018-07-04)

        * 放大、缩小好了

v0.1.1(2018-07-03)

        * 左侧"绘制栏"功能好了
        * 右侧"编辑栏"功能好了
        * 中间"查看栏"待做
