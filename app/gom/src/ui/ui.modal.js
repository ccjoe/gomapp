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
     * 弹层层的家庭比较大，有Loading，confirm， alert, center, popover, tips, popup, top , bottom, toast
     * 所有弹出层不可共存，但modal与toast可一起显示.
     *  @todo 模态类型分拆及共存问题？
     *  @class Gom.UI.Modal
     *  @alias Modal
     *  @extends {Gom.View}
     *  @param {object} opts 传入的opts参数，会覆盖static默认参数
     *  @param {string} [opts.type]  自定义GomUI不存在的弹出层组件时才需要指定
     *  @param {string} [opts.title] 弹层标题
     *  @param {html|string} [opts.content] 弹层的html内部
     *  @param {string} [opts.class] 弹层自定义class
     *  @param {boolean} [opts.mask=false] 弹层是否显示遮罩
     *  @param {boolean} [opts.close] 当且仅当为true时会在右上角显示关闭小图标
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
            $.extend(opts, this);   //将List实例混合到opts上， 去父对象上执行(_super())
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

            if(this.is('toast')){
                this.autoHide(3000);
            }
            this.initEvents();
        },
        initEvents: function(){
            var that = this, $t;
            $('.modal-layout').off().on('click', '.modal-btn, .icon-close', function(){
                $t = $(this);
                if($t.hasClass('modal-btn-yes')){
                    that._onYes();
                }else if($t.hasClass('modal-btn-no') || $t.hasClass('icon-close')){
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
        is: function(type){
            return this.getType().indexOf(type)!==-1;
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
            var $el;
            var ist = this.is('toast'); isl = this.is('loading');
            if(ist) return $('.modal-toast');
            if(isl) return $('.modal-loading');
            return $('.modal-layout');
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
            $gm.fx({opacity: 0.5, translate3d: '0,100%,0', perspective:1000}, 500, 'easeOutCirc', function(){
                $gm.remove();
            });
        },
        /**
         * 重置为动画前状态, 会根据modal所处的位置重置modal会置
         * @method Gom.UI.Modal#reloc
         * @private
         */
        reloc: function(){
            var ml = this.getModal(), isTB = this.isTopBot(), isToast = this.is('toast'),
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
         * @param {boolean} mask是否需要 mask
         */
        loading:function(mask){
            return new Modal({
                data:{
                    type: 'loading',
                    btns: false,
                    title: false,
                    mask: mask
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
                mask: false,
                close: true
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
                }
            };
            return this.layout(bottomStatic, opts, 'bottom').render();
        },
        /**
         * popup 较类似于bottom,只不过是全屏的 :)
         * @method Gom.UI.Modal.bottom
         */
        popup: function(opts){
            var popupStatic = {
                title: opts.title || '',
                class: 'modal-popup',
                btns: {
                    yes: 'OK',
                    no: '取消'
                }
            };
            return this.layout(popupStatic, opts, 'bottom').render();
        },
        /**
         * 显示 popover layout
         * @method Gom.UI.Modal.popover
         * @param {object|string} opts 传入的opts参数为object时，会覆盖static默认参数, opts参数:@see Gom.UI.Modal#opts 传入的opts参数为string时，则表示为opts.content
         * @param {object|string} opts.bindElem 弹出层绑定的元素（位置）
         * @return {Modal} 弹出层实例
         */
        popover: function(opts){
            var popoverStatic = {
                title: '',
                btns: false
            };
            if(!opts.bindElem){
                console.warn('没有定义popover弹出层绑定的元素');
                return;
            }else{
                var $bindElem = $(opts.bindElem),
                    pos = $bindElem.offset();
            }
            var popover = this.layout(popoverStatic, opts, 'popover').render();
            var top, trisize = 20, tripos = 'tri-bottom',
                $modal = popover.getModal(), mw = $modal.width(), mh = $modal.height(),
                top = pos.top - mh/2 - trisize/2,
                left = pos.left+(pos.width-mw)/2,
                fullWidth = $('body').width(), gap = 10;

            if(pos.top< mh){
                top = pos.top + mh/2 + trisize;
                tripos = 'tri-top';
            }
            console.log(left, fullWidth, mw, mh, top, left, 'size');
            if(left < gap){
                left = gap;
                tripos += ' tri-left';
            }else if(left>fullWidth-mw-gap){
                left = fullWidth-mw-gap;
                tripos += ' tri-right';
            }
            $modal.addClass(tripos).css({
                left: left,
                top: top
            });

            return popover;
        },
        /**
         * 显示 tips,实质就是popover，加上tips的样式而已(啊？不好意思暂不能多开，原因，你猜！)
         * @method Gom.UI.Modal.tips
         * @param {object|string} opts 传入的opts参数为object时，会覆盖static默认参数, opts参数:@see Gom.UI.Modal#opts 传入的opts参数为string时，则表示为opts.content
         * @param {object|string} opts.bindElem 弹出层绑定的元素（位置）
         * @return {Modal} 弹出层实例
         */
        tips: function(opts){
            $.extend(opts, {'class': 'modal-tips', mask: false});
            ModalExtend.popover(opts);
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
