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
    var noop = function(){};
    var Modal = View.extend({
        init: function (opts) {
            opts.data = $.extend({}, data, opts.data);
            $.extend(opts, this);   //将List实例混合到opts上， 去父对象上执行
            opts.tmplname = 'ui.modal';
            opts.wrapper = opts.wrapper || '#Modal';
            this._super(opts);
            this.yes = opts.yes || noop;
            this.no = opts.no || noop;
        },
        //显示视图
        show: function (){
            this.wrapper.show().html(this.getHTMLFragment());
            this.reloc();
            this.showModal();
            if(this.data.type.indexOf('toast')!==-1){
                //this.autoHide();
            }
        },
        getModal: function(){
            return this.wrapper.find('.modal-layout');
        },
        showModal: function(){
            this.getModal().css({
                opacity: 0,
                transform: 'scale(2)'
            }).fx({
                opacity: 1,
                scale: 1
            }, 500, 'easeOutBack');
        },
        hideModal: function(){
            var that = this;
            this.getModal().fx({
                opacity: 0,
                scale: 0.2
            }, 500, 'easeInBack', function(){
                that.wrapper.hide();
            });
        },
        reloc: function(){
            var ml = this.wrapper.find('.modal-layout');
            ml.css({'height': ml.height(), 'margin-top':-ml.height()/2});
        },
        close: function(){
            this.wrapper.hide();
        },
        autoHide: function(){
            var that = this;
            var time = setTimeout(function(){
                that.wrapper.hide();
                clearTimeout(time);
            }, 3000);
        },
        events: {
            'click .modal-overlay': 'onNo',
            'click .modal-btn-yes': 'onYes',
            'click .modal-btn-no': 'onNo',
        },
        onYes: function(){
            this.yes();
            this.hideModal();
        },
        onNo: function(){
            this.no();
            this.hideModal();
        }
    });

    var ModalExtend = {
        layout: function(static, opts){
            return   new Modal({data: $.extend({}, opts, static)});
        },
        alert:function(opts){
            var alertStatic = {
                type: 'alert',
                title: opts.title || '警告:',
                btns: {
                    yes: 'OK'
                }
            };
            console.log($.extend({}, opts, alertStatic));
            return this.layout(alertStatic, opts);
        },
        confirm:function(opts){
            var confirmStatic = {
                type: 'confirm',
                title: opts.title || '请确认:',
                btns: {
                    yes: '确定', no: '取消'
                }
            };
            return this.layout(confirmStatic, opts);
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
        toast: function(toastType, content){
            toastType = toastType || 'info';
            return new Modal({
                wrapper: '#Toast',
                data:{
                    type: 'toast-'+toastType,
                    content: content,
                    btns: false,
                    title: false
                }
            })
        }
    };
    return $.extend({}, {modal: Modal}, ModalExtend);
});
