define(['base/core/view'], function(View) {
    var data = {
        type: 'loading', //alert, confirm, topup, top, bottom,
        btns: {
            yes: '确定',
            no:  '取消'
        },
        title: '',
        content: '',   //content为str或html,如果为function则需要返回str或html
        class: '',
        mask: true
    };
    var noop = function(){};
    var Modal = View.extend({
        init: function (opts) {
            opts.data = $.extend({}, data, opts.data);
            $.extend(opts, this);   //将List实例混合到opts上， 去父对象上执行
            opts.tmplname = 'ui.modal';
            opts.wrapper = opts.wrapper || '#modal';
            this._super(opts);
            this.yes = opts.yes || noop;
            this.no = opts.no || noop;
            this.mask = opts.mask;
        },
        //显示视图
        show: function (frag){
            this.wrapper.fadeIn(100);
            this.reloc();
            this.toggleModal();

            if(this.isToast()){
                this.autoHide();
            }
            if(this.mask !== true){
                $('.modal-overlay').removeClass('modal-overlay-visible');
            }
        },

        getType: function(){
            return this.data.type;
        },
        isToast: function(){
            return this.getType().indexOf('toast')!==-1;
        },
        /**
         *@return {string} top|bottom, false时为非modal top|bottom
         */
        isTopBot: function(){
            var type =  this.getType();
            var is = (type ==='top' || type==='bottom');
            if(is){return type}
            return is;
        },
        getModal: function(){
            return this.wrapper.find(this.isToast() ? '.modal-toast' : '.modal-layout');
        },
        /**
         * 判断显示与隐藏及相应动画
         * @method Page#PUSH
         * @param {string} inOrOut in|显+out|隐
         * @param {function} callback
         **/
        toggleModal: function(inout){
            inout = inout || 'In';
            var pos = this.isTopBot();
            if(pos){
                this['slide'+inout+'Modal'](pos);
            }else{
                this['scale'+inout+'Modal'](); //居中
            }
        },

        scaleInModal: function(){
            this.getModal().css({
                opacity: 0.2, transform: 'scale(1.5)'
            }).fx({
                opacity: 1, scale: 1
            }, 300, 'easeOutBack');
        },
        scaleOutModal: function(){
            var that = this;
            this.getModal().fx({
                opacity: 0, scale: 0.2
            }, 300, 'easeInBack', function(){
                that.wrapper.hide();
            });
        },
        /**
         *@param {string} pos top|bottom
         */
        slideInModal: function(pos){
            var fxprops = {opacity: 1};
                fxprops[pos] = 0;
            this.getModal().fx(fxprops, 300, 'easeOutBack');
        },
        slideOutModal: function(pos){
            var that = this;
            var fxprops = {opacity: 0};
                fxprops[pos] = -this.getModal().height();
            this.getModal().fx(fxprops, 300, 'easeOutBack', function(){
                that.wrapper.hide();
            });
        },
        //重置为动画前状态
        reloc: function(){
            var ml = this.getModal(),  h = ml.height(), pos = this.isTopBot();
            var props = {}; props[pos] = -h;
            ml.css('height', h).css(pos ? props : {'margin-top': -h/2}); //居上|下 //居中
        },
        close: function(){
            this.wrapper.hide();
        },
        autoHide: function(){
            var that = this;
            var time = setTimeout(function(){
                that.toggleModal('Out');
                clearTimeout(time);
            }, 3000);
        },
        events: {
            'click .modal-overlay': 'onNo',
            'click .modal-btn-yes': 'onYes',
            'click .modal-btn-no': 'onNo'
        },
        onYes: function(){
            this.yes();
            this.toggleModal('Out');
        },
        onNo: function(){
            this.no();
            this.toggleModal('Out');
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
            return this.layout(alertStatic, opts).render();
        },
        confirm:function(opts){
            var confirmStatic = {
                type: 'confirm',
                title: opts.title || '请确认:',
                btns: {
                    yes: '确定', no: '取消'
                }
            };
            return  this.layout(confirmStatic, opts).render();
        },
        loading:function(){
            return new Modal({
                data:{
                    type: 'loading',
                    btns: false,
                    title: false,
                    mask: false
                }
            }).render();
        },
        top: function(opts){
            var bottomStatic = {
                type: 'top',
                title: opts.title || '',
                btns: false,
                content: {
                    'list': 'asdfas'
                }
            };
            return this.layout(bottomStatic, opts).render();
        },
        //
        bottom: function(opts){
            //比如下面的时间选择器， ACTIONSHEET等
            var bottomStatic = {
                type: 'bottom',
                title: opts.title || '',
                btns: {
                    no: '取消',
                    //yes: '完成'
                },
                content: opts.content
            };
            return this.layout(bottomStatic, opts).render();
        },
        popover: function(opts){
            var tipsStatic = {
                type: 'tips',
                btn: false,
                content: [{},{},{}]
            };
            return this.layout(tipsStatic, opts).render();
        },
        toast: function(content, toastType){
            toastType = toastType || 'info';
            return new Modal({
                wrapper: '#toast',
                data:{
                    type: 'toast-'+toastType,
                    content: content,
                    btns: false,
                    title: false
                }
            }).render();
        }
    };
    return $.extend({}, {modal: Modal}, ModalExtend);
});
