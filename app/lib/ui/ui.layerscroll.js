define(['base/ui/ui.modal'], function(Modal) {
    //比如下面的时间选择器,日期选择器，三级城市区域选择器等
    var bottomStatic = {
        type: 'bottom',
        title: opts.title || '',
        content: opts.content
    };
    var layerScroll = function(){
        new Modal({data: $.extend({}, bottomStatic, opts)});
    }
});
