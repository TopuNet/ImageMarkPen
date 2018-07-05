ImageMarkPen 1.1.1
===
### 基于canvas的图片标记插件

功能介绍
---
1. jquery+canvas，编辑后可以返回编辑后的base64
1. 引入[hidpi-canvas-polyfill](https://github.com/jondavidjohn/hidpi-canvas-polyfill)，实现canvas自动匹配window.devicePixelRatio
1. 引入[jquery-ui](https://jqueryui.com)，解决ie+edge不支持resize样式的问题。jquery-ui是根据需要release的版本，同时只有ie+edge用。
1. 弹层是基于[LayerShow_2.5.4](https://github.com/TopuNet/LayerShow/tree/2.5.4)写的，包括后期的编辑都放在一起了。理论上是可以不依靠LayerShow的。时间关系，暂时先这样了，有时间再剥离
1. 部分代码用到了es6，dist提供了es6和babel后的版本，同时为了兼容ie，要引用babel的polyfill(assets文件夹中有)
1. demo中提供了amd版本和原生引用版本
1. 后续会考虑扩展移动端兼容

<img src="https://github.com/agulado/ImageMarkPen/blob/master/demo/ImageMarkPen.png" />

npm
---
```sh
npm install image-markup
```

文件说明
---
#### dist：

```
ImageMarkPen_es2015.js是源码
ImageMarkPen.js是babel过的。
```

#### dist/assets：

1. inc/canvas_hidpi.js: [hidpi-canvas-polyfill](https://github.com/jondavidjohn/hidpi-canvas-polyfill)

```
在ImageMarkPen.js(描述具体位置或行号时，均指ImageMarkPen_es2015.js，后同)最底部的amd封装中引用，非amd规范请在视图中引用

```

1. inc/jquery-ui.min.css: [jquery-ui](https://jqueryui.com)

```
jquery-ui的样式表。
在ImageMarkPen.js的show()方法(line 33)中引用
```

1. inc/jquery-ui-icons_444444_256x240.png:

```
jquery-ui的图标。
在inc/jquery-ui.min.css中搜索444444可以找到
```

1. widget/lib/polyfill.min.js: [babel-polyfill](https://www.babeljs.cn/docs/usage/polyfill/)

```
在ImageMarkPen.js最底部的amd封装中引用，非amd规范请在视图中引用
```

1. widget/lib/jquery-ui.min.js: [jquery-ui](https://jqueryui.com)

```
在ImageMarkPen.js最底部的amd封装中引用，非amd规范请在视图中引用
```

使用
---
#### 调用：

```javascript
	ImageMarkPen.show({
		Pics: "demo.jpg", // 打开的图片路径
		DrawRecord: [], // 默认恢复的绘制记录。编辑成功后，会返回编辑的记录，此处传入可用于图片保存前的再次操作 或 图片不保存而是保存绘制记录到数据库
		callback_before: function() { 
		    // 弹层显示前的回调
		},
		callback_success: function() { 
		    // 弹层成功显示后的回调（此时图片已加载成功）
		},
		callback_button_cancal: function() { 
		    // 点击编辑按钮-取消时的回调，ImageMarkPen不会自动关掉，需调用close()方法，此时可给一些警告提示。
		    ImageMarkPen.close();
		},
		callback_button_finish: function(base64, DrawRecord) { 

			// 点击编辑按钮-完成时的回调(@base64=编辑后的图片base64; @DrawRecord=绘制记录数组)，同样，需要close()才会关闭弹层
		    debug.log(base64);
		    debug.log(DrawRecord);
		    ImageMarkPen.close();
		},
		callback_close: function() { 
			// 弹层关闭后的回调
		}
	});
```

#### 关闭：

```javascript
ImageMarkPen.close();
```

更新日志：
---
v1.1.1(2018-07-05)
		
		* 整理资源文件，上线

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
