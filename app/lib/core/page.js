define(['base/core/view', 'base/ui/ui'], function(View, UI){
    /**
     * page.js相关
     * 1. 页面转场相关
     * 2. 自动初始化页面，在此基础上可以定义ctrl去获取数据与改变数据结构再渲染页面
     * 3. 支持声明式组件写法
     * 4. 页面SEO相关的设置
     * @extend View
     * @example
     **/
    var Page = View.extend({
        init:function (opts) {
            opts.wrapper = opts.wrapper || opts.config.selector.wrapper || '#viewport';
            this.title  = opts.title || '';
            this.widgets = [];
            this.dom = {
                root   : opts.root || '',
                header : opts.header || '',
                footer : opts.footer || ''
            };
            this.seo = opts.seo || {
                    title: '',
                    keywords: '',
                    description: ''
                };
            this.isback = opts.isback;
            this._super(opts);
        },

        render: function (cb) {
            var that = this;
            this.getTmpl('view', function(){
                that.show();
                cb ? cb() : null;
            });
        },
        show: function(){
            this.push(this.getHTMLFragment(), !this.isback ? 'swipe-left':'swipe-right');
            //this._parseEvent();
            if (this.title) {
                this.setHeader();
            }
            this.initWidgetUI();
        },
        //自动实例化组件，去支持声明式初始UI组件
        initWidgetUI: function(){
            var $t, uitype, that = this;
            $('body').find('[ui-widget]').each(function(i, it){
                $t = $(it);
                uitype = $t.attr('ui-widget');

                that.widgets[i] = new UI[uitype]({
                    wrapper: $t,
                    data: $.extend({}, $t.data('opts'), {title: $t.text()})
                });
                that.widgets[i].render();
            });
        },
        /**
         * 设置heaer
         * @method Page#PUSH
         * @param {dom} dom 推入的html
         * @param {effect} swipe-left, swipe-rigth, swipe-top, swipe-bottom 推入的html
         * 保留最近的二个页面
         **/
        push: function(dom, effect){
            var $dc = $(this.wrapper ? this.wrapper : '#viewport');
                $dc.append(dom);
            var $dcct = $dc.find('.content');
            if($dcct.length > 2){
                $dcct.eq(0).remove();
            }

            if(!effect){    //如果没有效果直接放进去
            }else{
                var xy = /left|right/.test(effect) ? 'X' : 'Y',
                    val = /left|top/.test(effect) ? '100%' : '-100%',
                    effcss = 'translate'+xy+'('+val+')';

                var $ct = $dc.find('.content');
                if(/swipe-/.test(effect)){
                    $ct.css({'transform': effcss})
                        .animate({
                            translateX: '0',
                            translate3d: '0,0,0'
                        }, 300, 'ease-out');
                    return;
                }
            }
        },

        getHeader: function(data, opts){
            var headerTmpl,
                tit = '<h1 class="title">{{title}}</h1>',
                btn = '<button class="btn btn-{{postion}}"></button>',
                arrow = '<a class="icon icon-{{postion}}-nav pull-{{postion}}"></a>';

            if(opts.subTitle){

            }

            if(opts.left){
                headerTmpl = tit;
            }

            if(opts.right){
                headerTmpl = tit+arrow;
            }

            var header = new View(titleTmpl, data, '#header');
        },
        /**
         * 设置heaer
         * @method App#setHeader
         * @param {string} title 标题
         * @param {object} opts
         * @props opts.types 头部类型， 有左右按钮型， 左右链接型， tab型
         * @props opts.subTitle 副标题
         * @props opts.left  header左侧 文字或html
         * @props opts.right header右侧 文字或html
         * @props opts.html  header右侧 文字或html
         * @return {object} CRO (Current Router Object)返回具体路由指向的路由表对象
         */
        setHeader: function () {
            //alert(this.title);
            $('header.bar .title').text(this.title);
        },
        setSeo: function(seoInfo){

        },
        setFooter: function () {

        },
        refresh: function (data) {

        }
    });
    return Page;
});
