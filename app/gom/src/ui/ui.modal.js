define(['View','Fx'], function(View) {
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
    /**
     * 弹层底层抽象类，如果需要自定义弹出层才需要用到, 自定义一般于Modal.layout，不满足才需要用到此类
     * 所有弹出层不可共存，但modal与toast可一起显示.
     *  @todo loading应该处理为可与其它弹出层共存
     *  @class Gom.UI.Modal
     *  @alias Modal
     *  @extends {Gom.View}
     *  @param {object} opts 传入的opts参数，会覆盖static默认参数
     *  @param {string} [opts.type]  自定义GomUI不存在的弹出层组件时才需要指定
     *  @param {string} [opts.title] 弹层标题
     *  @param {html|string} [opts.content] 弹层的html内部
     *  @param {string} [opts.class] 弹层自定义class
     *  @param {boolean} [opts.mask] 弹层是否显示遮罩
     *  @param {object} [opts.btns]  弹出层组件时按钮
     *  @param {string} [opts.btns.yes] 确定按钮名称
     *  @param {string} [opts.btns.no]  取消按钮名称
     *  @example opts对象可传入的有如下对象，如果opts为string时，则表示为opts.content
     *  {  type: '',  //在具体实例中已定义，扩展时可自定义名称
           btns: {
                yes: '确定',
                no:  '取消'
            },
            title: '',
            content: '',   //content为str或html,如果为function则需要返回str或html
            class: '',
            mask: true,
            onYes: function(){},
            onNo: function(){}
            }
     */
    var Modal = View.extend({
        init: function (opts) {
            opts.data = $.extend({}, data, opts.data);
            $.extend(opts, this);   //将List实例混合到opts上， 去父对象上执行
            opts.tmplname = 'ui.modal';
            opts.wrapper = opts.wrapper || '.modal-layout';
            this._super(opts);
            this.onYes = opts.data.onYes || noop;
            this.onNo = opts.data.onNo || noop;
            this.mask = opts.data.mask;
        },
        render: function(){
            var wrap = $('body');
            var frag = this.getHTMLFragment();
            var modal = this.getModal();
            if(!this.getModal().length){
                wrap.append(frag);
            }else{
                modal.replaceWith(frag);
            }
            this.show();
            return this;
        },
        /**
         * 显示弹层
         * @method Gom.UI.Modal#show
         */
        show: function (){
            this.reloc();
            this.toggleModal();

            if(this.isToast()){
                //this.autoHide(3000);
            }
            this.initEvents();
        },
        initEvents: function(){
            var that = this, $t;
            $('.modal-layout').off().on('click', '.modal-btn', function(){
                $t = $(this);
                if($t.hasClass('modal-btn-yes')){
                    that._onYes();
                }else if($t.hasClass('modal-btn-no')){
                    that._onNo();
                }
            });
            $('.modal-overlay').off().click(function(){
                that._onYes();
            });
        },
        /**
         * 获取弹出层类型，即data.type
         * @method Gom.UI.Modal#getType
         */
        getType: function(){
            return this.data.type;
        },
        isToast: function(){
            return this.getType().indexOf('toast')!==-1;
        },
        isTopBot: function(){
            var type =  this.getType();
            var is = (type ==='top' || type==='bottom');
            return is ? type : is;
        },
        /**
         * 获取弹层elements
         * @method Gom.UI.Modal#getModal
         * @returns {*|jQuery|HTMLElement}
         */
        getModal: function(){
            return $(this.isToast() ? '.modal-toast' : '.modal-layout');
        },
        /**
         * 获取遮罩层
         * @method Gom.UI.Modal#getMask
         * @returns {*|jQuery|HTMLElement}
         */
        getMask: function(){
            return $('.modal-overlay');
        },
        /**
         * 判断显示与隐藏及相应动画
         * @method Gom.UI.Modal#toggleModal
         * @param {string} [inOrOut=In] in|显+out|隐
         * @desc 上下弹出层会采用slide+fade动画，其它采用scale+fade
         **/
        toggleModal: function(inout){
            inout = inout || 'In';
            var pos = this.isTopBot();
            if(pos){
                this['slide'+inout+'Modal'](pos);
            }else{
                this['scale'+inout+'Modal']();
            }
            if(this.mask){
                this.getMask()[inout==='In'?'addClass':'removeClass']('modal-overlay-visible');
            }
        },
        scaleInModal: function(){
            this.getModal().css({opacity: 0.8, transform: 'scale(1.2)'}).fx({opacity: 1, scale: 1, perspective:1000}, 500, 'easeOutCirc');
        },
        scaleOutModal: function(){
            var $gm = this.getModal();
            $gm.fx({opacity: 0, scale: 0.8, perspective:1000}, 300, 'easeOutCirc', function(){
                $gm.remove();
            });
        },
        slideInModal: function(){
            this.getModal().fx({opacity: 1, translate3d: '0,0,0', perspective:1000}, 500, 'easeOutCirc');
        },
        slideOutModal: function(){
            var $gm = this.getModal();
            $gm.fx({opacity: 0, translate3d: '0,100%,0', perspective:1000}, 300, 'easeOutCirc', function(){
                $gm.remove();
            });
        },
        /**
         * 重置为动画前状态, 会根据modal所处的位置重置modal会置
         * @method Gom.UI.Modal#reloc
         * @private
         */
        reloc: function(){
            var ml = this.getModal(), isTB = this.isTopBot(), isToast = this.isToast(),
                h = ml.height(), w = ml.width(), centerProps={};
            if(isToast){
                centerProps['margin-left'] = -w/2;
            }else if(!isTB){
                centerProps['margin-top'] = -h/2;
            }
            ml.css(centerProps);
        },
        remove: function(){
            this.getModal().remove();
        },
        /**
         * 经过times millseconds 自动隐藏弹层
         * @method  Gom.UI.Modal#autoHide
         * @param {number} times 毫秒数
         */
        autoHide: function(times){
            var that = this;
            var time = setTimeout(function(){
                that.toggleModal('Out');
                clearTimeout(time);
            }, times);
        },
        _onYes: function(){
            this.onYes();
            this.toggleModal('Out');
        },
        _onNo: function(){
            this.onNo();
            this.toggleModal('Out');
        }
    });

    var ModalExtend = {
        /**
         * 此方法一般用于自定义弹出层组件, 抽象类Modal的抽象实例
         * @method Gom.UI.Modal.layout
         * @param {object} static 默认参数
         * @param {object|string} opts 传入的opts参数为object时，会覆盖static默认参数, opts参数:@see Gom.UI.Modal#opts
         *                              传入的opts参数为string时，则表示为opts.content
         * @param {string} type 弹出层对象的名称
         *  opts对象可传入的有如下对象，如果opts为string时，则表示为opts.content
         * @return {Modal} 弹出层实例
         */
        layout: function(static, opts, type){
            var optsObj = {};
            if(typeof opts === 'string'){
                optsObj.content = opts;
            }else{
                optsObj = opts;
            }

            return new Modal({data: $.extend({}, static, optsObj, {type: type})});
        },
        /**
         * 显示警告框
         * @method Gom.UI.Modal.alert
         * @param {object|string} opts 传入的opts参数为object时，会覆盖static默认参数, opts参数:@see Gom.UI.Modal#opts
         *                              传入的opts参数为string时，则表示为opts.content
         * @return {Modal} 弹出层实例
         */
        alert:function(opts){
            var alertStatic = {
                title: opts.title || '警告:',
                btns: {
                    yes: 'OK'
                }
            };
            return this.layout(alertStatic, opts, 'alert').render();
        },
        /**
         * 显示对话框
         * @method Gom.UI.Modal.confirm
         * @param {object|string} opts 传入的opts参数为object时，会覆盖static默认参数, opts参数:@see Gom.UI.Modal#opts
         *                              传入的opts参数为string时，则表示为opts.content
         * @return {Modal} 弹出层实例
         */
        confirm:function(opts){
            var confirmStatic = {
                title: opts.title || '请确认:',
                btns: {
                    yes: '确定', no: '取消'
                }
            };
            return  this.layout(confirmStatic, opts, 'confirm').render();
        },
        /**
         * 显示loading
         * @method Gom.UI.Modal.loading
         */
        loading:function(){
            return new Modal({
                data:{
                    type: 'loading',
                    btns: false,
                    title: false,
                    mask: false
                }
            });
        },
        /**
         * 显示对话框
         * @method Gom.UI.Modal.center
         * @param {object|string} opts 传入的opts参数为object时，会覆盖static默认参数, opts参数:@see Gom.UI.Modal#opts
         *                              传入的opts参数为string时，则表示为opts.content
         * @return {Modal} 弹出层实例
         */
        center:function(opts){
            var confirmStatic = {
                title: opts.title || '',
                btns: false
            };
            return  this.layout(confirmStatic, opts, 'center').render();
        },
        /**
         * 显示 top layout
         * @method Gom.UI.Modal.top
         * @param {object|string} opts 传入的opts参数为object时，会覆盖static默认参数, opts参数:@see Gom.UI.Modal#opts
         *                              传入的opts参数为string时，则表示为opts.content
         * @return {Modal} 弹出层实例
         */
        top: function(opts){
            var bottomStatic = {
                title: opts.title || '',
                btns: false,
            };
            return this.layout(bottomStatic, opts, 'top').render();
        },
        /**
         * 显示 bottom layout
         * @method Gom.UI.Modal.bottom
         * @param {object|string} opts 传入的opts参数为object时，会覆盖static默认参数, opts参数:@see Gom.UI.Modal#opts
         *                              传入的opts参数为string时，则表示为opts.content
         * @return {Modal} 弹出层实例
         */
        bottom: function(opts){
            //比如下面的时间选择器， ACTIONSHEET等
            var bottomStatic = {
                title: opts.title || '',
                btns: {
                    no: '取消',
                    yes: '完成'
                },
            };
            return this.layout(bottomStatic, opts, 'bottom').render();
        },
        popover: function(opts){
            var tipsStatic = {
                type: 'tips',
                btn: false,
                content: [{},{},{}]
            };
            return this.layout(tipsStatic, opts).render();
        },
        /**
         * 显示不同类型的弹出提示
         * @param {string} content 显示的内容;
         * @param {string} toastType 显示类别，有 warn info error, 默认info;
         * @return {Modal} 弹出层实例
         */
        toast: function(content, toastType){
            toastType = toastType || 'info';
            return new Modal({
                data:{
                    type: 'toast-'+toastType,
                    content: content,
                    btns: false,
                    title: false,
                    mask: false
                }
            }).render();
        }
    };
    return $.extend({}, {modal: Modal}, ModalExtend);
});