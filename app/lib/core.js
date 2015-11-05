/**
 * Created by sfliu on 2015/10/28.
 * dependencies history [history.js]
 * dependencies template [underscore.js] -> dot.js
 * dependencies touch [fastclick.js]
 * dependencies amd [require.js]
 * dependencies ui [ratchet]
 * @todo 1.template localstorage    2. tempate use dot  3.remove history.js
 */

define(['base/utils/url'], function(url) {
    if ('addEventListener' in document) {
        document.addEventListener('DOMContentLoaded', function() {
            FastClick.attach(document.body);
        }, false);
    }

    //模板引擎 dot => underscore, doT拥有此功能且性能高
    _.templateSettings = {
        evaluate    : /\{\{(.+?)\}\}/g,
        interpolate : /\{\{=(.+?)\}\}/g,
        escape      : /\{\{\-(.+?)\}\}/g
    };

    //重、写_.underscore方式，去支持include语法
    function template(str, data) {
        // match "<% include template-id %>"
        return _.template(
            str.replace(
                // /<%\s*include\s*(.*?)\s*%>/g,
                /\{\{\s*include\s*(.*?)\s*\}\}/g,
                function(match, templateId) {
                    var el = document.getElementById(templateId);
                    // console.log(match, templateId, el, 'MATCH TMPLID');
                    return el ? el.innerHTML : '';
                }
            ),
            data
        );
    }
    /**
     * App对象
     * @namespace
     * @constructs App
     * @return {Object} App
     * @example
     * new App(config, route); 传入配置文件与路由文件
     */
    var App = function (config, route) {
        this.config = config || {};
        this.route = route || {};
        this.model = {};
        this.history = [];
    };

    /**
     * View对象
     * @namespace
     * @constructs App
     * @return {Object} App
     * @example
     * new App(config, route); 传入配置文件与路由文件
     */

    var View = function(tmpl, data, wrapper){
        this.tmpl   = tmpl  || '';
        this.data   = data || {};
        this.wrapper = wrapper;
    };

    View.prototype = {
        //render前update this.date即可刷新视图
        render: function (next){
            var dom = this.data ? template(this.tmpl)(this) : template(this.tmpl),
                $wrapperDom = this.wrapper ? $(this.wrapper) : $('#body');
            $wrapperDom.append(dom);
        },
        create: function(){

        },
        update: function(data, next){
            this.setData(data);
            this.render(next);
        },
        destory: function(){

        },
        setData: function(data){
            this.data = data;
        }
    };


    var Page = function (opts) {
        console.log(opts, 'opts');
        View.call(this, opts.tmpl, opts.data, opts.wrapper || opts.config.wrapper);
        this.title  = opts.title || '';
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
    };


    var Model = function(){
        this.url = '';
        this.data = data;
    };



    App.prototype = {
        init: function(){       //App初始化
            var that = this;
            var isHistoryApi = !!(window.history && history.pushState);
            if(!isHistoryApi){
                return;
            }

            History.Adapter.bind(window, 'statechange', function(e){
                var state = History.getState();
                state.data.hash = state.data.hash || '/';
                //state.data.prevHash = that.getPrevHash();
                console.log(document.referrer, state, 'state');
                that._routeByHash(state.data.hash);
            });
            History.Adapter.trigger(window, 'statechange');

            //对所有链接进行html5处理
            //@todo 需要处理为智能判断url与绝对、相应地址
            $("body").off().on("click", 'a', function(){
                var $t = $(this),
                    hash =  $t.attr('href').substring(1);
                History.pushState({hash: hash, prevHash: that.getPrevHash()}, $t.attr('title'), '?'+hash);
                return false;
            });
        },
        getPrevHash: function(){
            return location.search.substring(1);
        },
        setPage: function(opts){
            if(!opts){
                return;
            }
            opts.config = this.config;
            opts.isback = this.isBack();
            return new Page(opts);
        },
        /**
         * 根据完整hash获取页面对象(即具体路由指向的路由表对象)
         * @method App#getPageSets
         * @return {object} CRO (Current Router Object)返回具体路由指向的路由表对象
         * @example ?module/list  ?module/123
         */
        getPageSets: function (hashPath) {
            var hashRoute = url.getHashPath(hashPath, true),
                router = this.route;

            if (hashPath === '/') {
                return router[hashPath];
            }

            var hash1 = hashRoute[0],
                hash2 = hashRoute[1];

            var CRO = router['/' + hash1];

            console.log(hashPath, hashRoute, CRO, 'hashinfo');
            if (!hash2) {
                if (CRO && CRO.hasOwnProperty('/')) {
                    CRO = CRO['/'];
                }
            } else {
                //level2 hash没有匹配到路由表时, 看是否路由的为变量||ID
                if (!CRO['/' + hash2] && CRO.hasOwnProperty('/:var')) {
                    CRO = CRO['/:var'];
                    CRO.routeParams = hash2;
                } else {
                    CRO = CRO['/' + hash2];
                }
            }
            return CRO;
        },
        /**
         * 根据完整hash路由或CRO对象到页面，封装了_routeByHash 与 _routeByCRO实现
         * @method App#goto
         * @example module/list  module/123
         */
        goto: function(where){
            var isstr = typeof where === 'string';
            this[isstr ? '_routeByHash' : '_routeByCRO'](where);
        },
        /**
         * 根据完整hash路由到页面
         * @method App#_routeByHash
         * @example module/list  module/123
         */
        _routeByHash: function (hashPath) {
            this._manageHistory(hashPath);
            var CRO = this.getPageSets(hashPath);
            this._routeByCRO(CRO);
        },

        _routeByCRO: function(CRO){
            if(this.isRouteNotFound(CRO)){
                return;
            }
            var view = this.setPage(CRO),
                ctrl = CRO.ctrl;
            if(ctrl){
                ctrl.init(view);
            }else{
                view.render();
            }
            console.log( CRO, view, "----- CURRENT ROUTE! -----");
        },
        _manageHistory: function(hashPath){
            if(this.getLastHashByLastIndex(1) === hashPath){
                return;
            }
            var history = this.history;
            history.push(hashPath);
            if(history.length > 10){
                history.shift();
            }
            console.log(history, 'THIS HISTORY');
        },
        //从倒数位置index取历史hash
        getLastHashByLastIndex: function(index){
            var history = this.history;
            return history[history.length-index];
        },
        isBack: function(){
            var oldHashArr = url.getHashPath(this.getLastHashByLastIndex(2), true),
                newHashArr = url.getHashPath(this.getLastHashByLastIndex(1), true);
            console.log(_.compact(oldHashArr), _.compact(newHashArr),   'IS GO OR BACK');
            return _.compact(newHashArr).length < _.compact(oldHashArr).length;
        },
        //判断是否存在CRO而404
        isRouteNotFound: function(CRO){
            if (!CRO) {
                this.route['/404']['data'] = {url: location.href};
                this.goto('404');
                return true;
            }
            return false;
        }

    };

    Page.prototype = new View();
    Page.prototype = $.extend(Page.prototype, {
        render: function (next) {
            var that = this;
            if (!this.tmpl) {
                return;
            }
            $.get('/views/' + this.tmpl + '.html', function (tmpl) {
                var dom = that.data ? template(tmpl)(that) : template(tmpl);
                that.push(dom, !that.isback ? 'swipe-left':'swipe-right');
                if (that.title) {
                    that.setHeader();
                }
                next ? next(dom) : null;
            });
        },
        /**
         * 设置heaer
         * @method Page#PUSH
         * @param {dom} dom 推入的html
         * @param {effect} swipe-left, swipe-rigth, swipe-top, swipe-bottom 推入的html
         **/
        push: function(dom, effect){
            var $dc = $(this.wrapper ? this.wrapper : '#body');
            if(!effect){    //如果没有效果直接放进去
                $dc.html(dom);
            }else{
                var xy = /left|right/.test(effect) ? 'X' : 'Y',
                    val = /left|top/.test(effect) ? '100%' : '-100%',
                    effcss = 'translate'+xy+'('+val+')';

                var $ct = $dc.html(dom).find('.content');
                if(/swipe-/.test(effect)){
                    $ct.css({'transform': effcss})
                        .animate({
                            translateX: '0',
                            translate3d: '0,0,0'
                        }, 200, 'ease-out');
                    return;
                }
            }
        },

        getHeader: function(data, opts){
            var headerTmpl = '',
                title = '<h1 class="title">{{title}}</h1>',
                subtitle = '<h2 class="sub-title">{{subtitle}}</h2>'
                btn = '<button class="btn btn-{{postion}}"></button>',
                arrow = '<a class="icon icon-{{postion}}-nav pull-{{postion}}"></a>';

            if(opts.subTitle){
                headerTmpl = title+subtitle;
            }

            if(opts.left){
                headerTmpl += arrow;
            }

            if(opts.right){
                headerTmpl = title+arrow;
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
            $('header.bar .title').text(this.title);
        },
        setSeo: function(seoInfo){

        },
        setFooter: function () {

        },
        refresh: function (data) {

        }
    });
    return {
        App: App,
        View: View
    };
});
