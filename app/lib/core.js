/**
 * Created by sfliu on 2015/10/28.
 */
define(['core/core/url'], function(url) {
    if ('addEventListener' in document) {
        document.addEventListener('DOMContentLoaded', function() {
            FastClick.attach(document.body);
        }, false);
    }

    //模板引擎 dot => underscore, doT拥有此功能且性能高
    _.templateSettings = {
        evaluate    : /\{\{(.+?)\}\}/g,
        interpolate : /\{\{\=(.+?)\}\}/g,
        escape      : /\{\{\-(.+?)\}\}/g
    };
    var PUSH = function(opt){
        var $dc = opt.domContainer || $('#body'),
            $de = opt.domEmpty,
            $dp = opt.domPush;

        var eff = opt.effect;
        //如果没有效果直接放进去
        if(!eff){
            $dc.html($dp);
        }else{
            var transformStr = '';

            switch (eff){
                case 'swipe-left'  :
                    transformStr = 'translateX(100%)';
                    break;
                case 'swipe-right' :
                    transformStr = 'translateX(-100%)';
                    break;
                case 'swipe-top'   :
                    transformStr = 'translateY(100%)';
                    break;
                case 'swipe-bottom':
                    transformStr = 'translateY(-100%)';
                    break;
            }


            var $ct = $dc.html($dp).find('.content');
            if(/swipe-/.test(eff)){
                $ct.css({'-webkit-transform': transformStr})
                    .animate({
                        translateX: '0',
                        translate3d: '0,0,0'
                    }, 200, 'ease-out');
                return;
            }
            if(eff.test('fade')){
                $ct.css({'-webkit-transform': transformStr})
                    .animate({
                        opacity: 1
                    }, 200, 'ease-out');
            }
        }
    };
    window.PUSH = PUSH;

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
        this.views = '';
        this.ctrl = {};
        this.model = {};
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
        View.call(this, opts.tmpl, opts.data, opts.wrapper || opts.config.wrapper);
        this.title  = opts.title || '';
        this.dom = {
            root   : opts.root || '',
            header : opts.header || '',
            footer : opts.footer || '',

        };
        this.seo = opts.seo || {
            title: '',
            keywords: '',
            description: ''
        };
    };


    var Model = function(){
        this.data = data;
    };



    App.prototype = {
        init: function(){       //App初始化
            var that = this;
            var isHistoryApi = !!(window.history && history.pushState);
            if(!isHistoryApi){
                return;
            }

            History.Adapter.bind(window, 'statechange', routeState);
            History.Adapter.trigger(window, 'statechange');

            function routeState(){
                var state = History.getState();
                state.data.hash = state.data.hash || '/';
                console.log(state, 'state');
                that.routeTo(state.data.hash);
            }

            //对所有链接进行html5处理
            $("body").off().on("click", 'a', function(){
                var $t = $(this), hash =  $t.attr('href').substring(1);
                History.pushState({hash: hash}, $t.attr('title'), '?'+hash);
                alert(hash);
                return false;
            });

            $("")
        },
        setPage: function(opts){
            opts.config = this.config;
            return new Page(opts);
        },
        /**
         * 根据hash获取页面对象(即具体路由指向的路由表对象)
         * @method App#getPageSets
         * @return {object} CRO (Current Router Object)返回具体路由指向的路由表对象
         */
        getPageSets: function (hash) {

            //CRO CURRENT ROUTE,即对应路由表里面的对象
            //根据hash(层级)返回相应tmpl和ctrl对象
            //页面级跳转url   /#/example1;
            //页面内跳转hash  /#example2
            var hashRoute = url.getHashPath(hash, true),
                router = this.route.router;

            if (hash === '/') {
                return router[hash];
            }

            var hash1 = hashRoute[0],
                hash2 = hashRoute[1];

            var CRO = router['/' + hash1];

            console.log(hash, hashRoute, CRO, 'hashinfo');
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
                    CRO = CRO[hash2];
                }
            }
            return CRO;
        },

        routeTo: function (hash) {
            var router = this.route.router,
                CRO = this.getPageSets(hash),
                view = this.setPage(CRO);
            console.log(CRO, view, "----- CURRENT ROUTE! -----");
            if (!CRO) {
                router['/404']['data'] = {url: location.href};
                location.hash = '/404';
                return;
            }
            var CROCtrl = CRO.ctrl;
            //存在ctrl则初始化页面，否则则直接render页面
            if (CROCtrl) {
                CROCtrl.init(view);
            } else {
                view.render();
            }
        }
    };

    Page.prototype = new View();
    Page.prototype = $.extend(Page.prototype, {
        render: function (next) {
            var t = this;
            if (!this.tmpl) {
                return;
            }
            $.get('/views/' + this.tmpl + '.html', function (tmpl) {
                var dom = t.data ? template(tmpl)(t) : template(tmpl),
                    wrapperDom = t.wrapper ? t.wrapper : '#body',
                    $wrapperDom = $(wrapperDom);
                PUSH({
                    domContainer: $wrapperDom,
                    domEmpty: $("#body"),
                    domPush: dom,
                    effect: (t.go ? 'swipe-left' : 'swipe-right'),
                    complete: function () {
                    }
                });
                if (t.title) {
                    t.setHeader(t);
                }

                next ? next(dom) : null;

                //core.reset(CRO.tmpl==='404'? 1 : 0);
            });
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
        setHeader: function (opts) {
            $('header.bar .title').text(opts.title);
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
    //
    //var core = {
    //    config: {
    //        animate: false,     // animate: 是否开启动画
    //        iscroll: false,     //iscroll: 是否开启iscroll
    //        html5history: true
    //    },
    //    route: {},              //相关路由表对象，详细定义参考route.js
    //    init: function(){       //App初始化
    //        var isHistoryApi = !!(window.history && history.pushState);
    //        if(!isHistoryApi){
    //            return;
    //        }
    //
    //        History.Adapter.bind(window, 'statechange', routeState);
    //        History.Adapter.trigger(window, 'statechange');
    //
    //        function routeState(){
    //            var state = History.getState();
    //            state.hashName = url.getHashPath(History.getHash()) || '/';
    //            console.log(state,  'state');
    //            core.routeTo(state.hashName);
    //        }
    //
    //
    //        //对所有链接进行html5处理
    //        this.bindClick();
    //    },
    //    bindClick: function(){
    //        $("body").off().on("click", 'a', function(){
    //            var $t = $(this), hash =  $t.attr('href').substring(1);
    //            alert(hash);
    //            History.pushState({hash: hash}, $t.attr('title'), '?'+hash);
    //            core.routeTo(hash);
    //            return false;
    //        });
    //    },
    //    //解析路由
    //    //cr CURRENT ROUTE,即对应路由表里面的对象
    //    //根据hash(层级)返回相应tmpl和ctrl对象
    //    //页面级跳转url   /#/example1;
    //    //页面内跳转hash  /#example2
    //    hashRouteParse: function(hash){
    //
    //        var hashRoute = url.getHashPath(hash, true),
    //            router  = core.route.router;
    //
    //        if(hash === '/'){
    //            return router[hash];
    //        }
    //
    //        var hash1 = hashRoute[0],
    //            hash2 = hashRoute[1];
    //
    //        var cr = router['/'+hash1];
    //
    //        console.log(hash, hash1, hash2, cr, 'hashinfo');
    //        if(!hash2){
    //            if(cr && cr.hasOwnProperty('/')){
    //                cr = cr['/'];
    //            }
    //        }else{
    //            //level2 hash没有匹配到路由表时, 看是否路由的为变量||ID
    //            if(!cr['/'+hash2] && cr.hasOwnProperty('/:var')){
    //                cr = cr['/:var'];
    //                cr.routeParams = hash2;
    //            }else{
    //                cr = cr[hash2];
    //            }
    //        }
    //        return cr;
    //    },
    //    // 路由到相应页并根据情况初始化页面
    //    routeTo: function(hash){
    //        var router = core.route.router,
    //            cr = core.hashRouteParse(hash);
    //        console.log(cr, "----- CURRENT ROUTE! -----");
    //        //if(!cr){
    //        //    router['404']['data'] = {url: location.href};
    //        //    location.hash = '/404';
    //        //    return;
    //        //}
    //        var crCtrl = cr.ctrl;
    //        //存在ctrl则初始化页面，否则则直接render页面
    //        if(crCtrl){
    //            crCtrl.init(core, cr);
    //        }else{
    //            core.render(cr);
    //        }
    //    },
    //    //页面渲染
    //    //render 的 cr 即 route配置里的路由指向的对象
    //    //cr {tmpl, data, title, ...}
    //    render: function(cr, next){
    //        var dom, wrapperDom;
    //        if(!cr.tmpl){
    //            return;
    //        }
    //        console.log('/views/'+cr.tmpl+'.html', 'tmpl route');
    //        $.get('/views/'+cr.tmpl+'.html', function(tmpl){
    //            var dom = cr.data ? template(tmpl)(cr) : template(tmpl),
    //                wrapperDom = cr.rendeTo ? cr.rendeTo : '#body',
    //                $wrapperDom = $(wrapperDom);
    //            PUSH({
    //                domContainer: $wrapperDom,
    //                domEmpty: $("#body"),
    //                domPush: dom,
    //                effect: (cr.go ? 'swipe-left' : 'swipe-right'),
    //                complete: function(){}
    //            });
    //
    //            if(cr.title){
    //                $('header.bar .title').text(cr.title);
    //            }
    //
    //            next ? next(dom) : null;
    //
    //            //core.reset(cr.tmpl==='404'? 1 : 0);
    //        });
    //    },
    //
    //    goOrBack: function(oldURL, newURL){
    //        if(!oldURL){
    //            return 1
    //        }
    //
    //        var oldHASH = '#/' + core.getUrl(oldURL, 'hash'),
    //            newHASH = '#/' + core.getUrl(newURL, 'hash'),
    //            hashArr = core.hashParse(oldHASH).hashArr,
    //            hashToArr = core.hashParse(newHASH).hashArr;
    //        // console.log(oldHASH, newHASH, hashArr,  hashToArr, "TTTTTTTTT");
    //        if(hashToArr.length > hashArr.length){
    //            return 1;
    //        }else{
    //            return 0;
    //        }
    //    },
    //    //页面初始化(如果是404页，退二步，因为退到找不到的页面还是会跳转到404)
    //    reset: function(is404){
    //        $(core.config.returnClass).off().click(function(){
    //            history.go(!is404 ? -1 : -2);
    //        });
    //    },
    //    //1=>URL,
    //    //2=>传入key,返回value,
    //    // 传入 'hash' 返回hash名，
    //    // 传入 'search' 返回kv字符串,
    //    // 传入 'domain' 返回.com|.net ~~~,
    //    // 否则返回key:value obj;
    //
    //    getUrl: function (url, keyOrObj) {
    //        //对url进行decodeURIComponen解码
    //        url = decodeURIComponent(url);
    //        var hashsearch = !~url.indexOf('#') ? '' : url.substr(url.indexOf('#') + 2);
    //        var pos = hashsearch.indexOf('?');
    //
    //        var hash,search,kvArr;
    //        if (!!~pos) {
    //                hash = hashsearch.substr(0, pos);
    //                search = hashsearch.substr(pos + 1);
    //                kvArr = search.split('&');
    //        } else {
    //                hash = hashsearch;
    //                search = '';
    //                kvArr = [];
    //        }
    //
    //        var kvObj = {};
    //        for (var i = 0; i < kvArr.length; i++) {
    //            var kvi = kvArr[i];
    //            kvObj[kvi.substr(0, kvi.indexOf('='))] = kvi.substr(kvi.indexOf('=') + 1);
    //        }
    //        if (typeof keyOrObj === 'string') {
    //            if (keyOrObj === 'hash') {
    //                return hash;
    //            }
    //            if (keyOrObj === 'search') {
    //                return search;
    //            }
    //            if (keyOrObj === 'domain') {
    //                var durl = /http:\/\/([^\/]+)\//i,
    //                    domain = str.match(durl);
    //                return domain[1].substr(domain[1].lastIndexOf('.') + 1);
    //            }
    //            return kvObj[keyOrObj];
    //        }
    //        return kvObj;
    //    },
    //
    //    //传入key,value 或 obj,均自动解析
    //    // serialize| single=Single&multiple=Multiple&multiple=Multiple3&check=check2&radio=radio1
    //    setUrl: function (url, keyValueOrObj, value) {
    //        var kvpair;
    //        if (typeof keyValueOrObj === 'string') {
    //            kvpair = keyValueOrObj + '=' + value;
    //            if (!~url.indexOf('?')) {
    //                return url + '?' + kvpair;
    //            } else {
    //                return url + '&' + kvpair;
    //            }
    //        } else if (typeof keyValueOrObj === 'object') {
    //            kvpair = $.param(keyValueOrObj);
    //            if (!~url.indexOf('?')) {
    //                return url + '?' + kvpair;
    //            } else {
    //                return url + '&' + kvpair;
    //            }
    //        }
    //    }
    //};
    //
    //
    //return core;
});
