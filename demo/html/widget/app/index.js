"use strict";

define(["modules/debug", "lib/ImageMarkPen", "lib/polyfill"], function($debug, $ImageMarkPen) {
    var $index = {
        init: function() {
            $debug.warn("index 6: init()");

            $("ul.panel li").css("height", "100vh");

            $index.ShowMarkLayer();
        },
        // 弹层
        ShowMarkLayer: function() {
            $("ul.panel li").on("click", function() {
                var _this = this;

                var index = $(this).index();

                $ImageMarkPen.show({
                    debug: true,
                    Pics: index + 1 + ".jpg",
                    DrawRecord: this.DrawRecord,
                    callback_before: function() {
                        return $debug.warn('index 18: callback_before()');
                    },
                    callback_success: function() {
                        return $debug.warn('index 19: callback_success()');
                    },
                    callback_button_cancal: function() {
                        $debug.warn('index 21: callback_button_cancal()');
                        $ImageMarkPen.close();
                    },
                    callback_button_finish: function(base64, DrawRecord) {
                        $debug.warn('index 25: callback_button_finish()');
                        $debug.log(base64);
                        $debug.log(DrawRecord);

                        $(_this).css("background-image", "url('" + base64 + "')");

                        _this.DrawRecord = DrawRecord;

                        $ImageMarkPen.close();
                    },
                    callback_close: function() {
                        $debug.warn('index 21: callback_close()');
                    }
                });
            });
        }
    };
    return $index;
});