define([
    "modules/debug",
    "lib/ImageMarkPen"
], function($debug, $ImageMarkPen) {
    const $index = {
        init: () => {
            $debug.warn(`index 6: init()`);

            $index.ShowMarkLayer();
        },
        // 弹层
        ShowMarkLayer: () => {
            $("ul.panel li").on("click", function() {
                const index = $(this).index();

                $ImageMarkPen.show({
                    Pics: `${index+1}.jpg`,
                    DrawRecord: this.DrawRecord,
                    callback_before: () => $debug.warn('index 18: callback_before()'),
                    callback_success: () => $debug.warn('index 19: callback_success()'),
                    callback_button_cancal: () => {
                        $debug.warn('index 21: callback_button_cancal()');
                        $ImageMarkPen.close();
                    },
                    callback_button_finish: (base64, DrawRecord) => {
                        $debug.warn('index 25: callback_button_finish()');
                        $debug.log(base64);
                        $debug.log(DrawRecord);

                        this.DrawRecord = DrawRecord;

                        $ImageMarkPen.close();
                    },
                    callback_close: () => {
                        $debug.warn('index 21: callback_close()');
                    }
                });
            });
        }
    };
    return $index;
});