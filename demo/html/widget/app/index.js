define([
    "modules/debug",
    "lib/ImageMarkPen"
], function($debug, $ImageMarkPen) {
    return $index = {
        init: (opt) => {
            $debug.warn(`index 6: init()`);

            $index.ShowMarkLayer();
        },
        // 弹层
        ShowMarkLayer: () => {
            $debug.debug(`index 13: ${$ImageMarkPen}`);
            $ImageMarkPen.show({
                Pics: '/4.jpg',
                callback_before: () => $debug.debug('index 16: callback_before()'),
                callback_success: () => $debug.debug('index 16: callback_success()'),
                callback_close: () => $debug.debug('index 16: callback_close()'),
            });
        }
    };
});