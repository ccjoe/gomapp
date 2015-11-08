define(['base/core/view'], function(View) {
    var data = {
        type: 'loading', //alert, confirm, topup, top, bottom,
        btns: {
            yes: '确定',
            no:  '取消'
        },
        title: '对话框',
        content: '这是对话框的内容或html'
    };

    var Layout = View.extend({
        init: function (opts) {
            opts.data = $.extend({}, data, opts.data);
            opts.tmplname = 'ui.layout';
            opts.wrapper = opts.wrapper;
            this._super(opts);
        },
        hide: function(){
          this.wrapper.hide();
        },
        close: function(){

        },
        events: {
            'click .layout::before': 'hide'
        },
    });

    var LayoutExtend = {
        alert:function(){},
        confirm:function(){},
        loading:function(){},
        topup:function(){},
        top: function(){},
        bottom: function(){},
        popover: function(){},
        toast: function(){}
    }
    return $.extend({}, {layout: Layout}, LayoutExtend);
});
