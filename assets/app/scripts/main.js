require.config({
    shim: {
        zepto: {
            exports: '$'
        }
    },
    paths: {
        zepto: '../../node_modules/zepto-mirror/dist/zepto'
    }
});

require(['zepto'], function($) {
    var win = window;

});