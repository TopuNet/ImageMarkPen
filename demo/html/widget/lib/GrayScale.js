/*
    v1.1.4
    高京
    20160324
    将图片变为灰色，可选鼠标悬停后是否复原
*/

var GrayScale = {
    init: function(para) {

        this.includeCSS("/inc/GrayScale.css");

        var para_default = {
            box_selector: null, // 作用范围选择器，如：body.index。无默认值
            hover_restore: true // 鼠标悬停时是否还原图片（即取消灰色滤镜），默认true
        };

        para = $.extend(para_default, para);

        if (para.hover_restore) {
            $(para.box_selector + " img.GrayScale").hover(function() {
                $(this).addClass("restore");
            }, function() {
                $(this).removeClass("restore");
            });

            $(para.box_selector + " svg.GrayScale image").hover(function() {
                $(this).css("filter", "none");
            }, function() {
                $(this).removeAttr("style");
            });
        }
    },

    includeCSS: function(path) {
        var a = document.createElement("link");
        a.type = "text/css";
        a.rel = "stylesheet";
        a.href = path;
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(a);
    }
};

if (typeof define === "function" && define.amd) {
    define(function() {
        return GrayScale;
    });
}
