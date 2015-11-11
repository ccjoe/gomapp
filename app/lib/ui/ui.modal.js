define(['base/core/view'], function(View) {
    var data = {
        type: 'loading', //alert, confirm, topup, top, bottom,
        btns: {
            yes: '确定',
            no:  '取消'
        },
        title: '',
        content: ''
    };

    var Modal = View.extend({
        init: function (opts) {
            opts.data = $.extend({}, data, opts.data);
            $.extend(opts, this);   //将List实例混合到opts上， 去父对象上执行
            opts.tmplname = 'ui.modal';
            opts.wrapper = '#Modal';
            this._super(opts);

        },
        close: function(){
            this.wrapper.hide();
        },
        events: {
            'click .modal-overlay': 'close'
        }
    });

    var ModalExtend = {
        alert:function(){},
        confirm:function(content){
            return new Modal({
                data:{
                    type: 'confirm',
                    title: '请确认:',
                    content: content
                }
            });
        },
        loading:function(){
            return new Modal({
                data:{
                    type: 'loading',
                    btns: false,
                    title: false
                }
            });
        },
        topup:function(){},
        top: function(){},
        bottom: function(){},
        popover: function(){},
        toast: function(){}
    }
    return $.extend({}, {modal: Modal}, ModalExtend);
});
