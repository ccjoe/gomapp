define(function(require) {

    // 将依赖外置
    // var Config = require('com/config'), 
    //     Route = require('com/route');

      //模板引擎 dot => underscore, doT拥有此功能且性能高
        _.templateSettings = {
            evaluate    : /\{\{(.+?)\}\}/g,  
            interpolate : /\{\{\=(.+?)\}\}/g, 
            escape      : /\{\{\-(.+?)\}\}/g   
        };  

        //重写_.underscore方式，去支持include语法
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

    var helper = {
        /*  
          animate: 是否开启动画
          iscroll: 是否开启iscroll
        */
        config: {
            animate: false,
            iscroll: false,
            html5history: true
        },
        //相关路由表对象，详细定义参考route.js
        route: {},
        //App初始化
        init: function(){
            //html4方法监听url hash变化
            // $(window).on('hashchange', helper.routeTo).trigger('hashchange');
            //以html5的方式处理状态变化
            // Note: We are using statechange instead of popstate
            var isHistoryApi = !!(window.history && history.pushState);
            if(!isHistoryApi)
                return;
            
            History.Adapter.bind(window, 'statechange', function(e){ 
                // Note: We are using History.getState() instead of event.state
                var state = History.getState(); 
                console.log(state, history, 'History');
                helper.routeTo(state);
            });
            History.Adapter.trigger(window, 'statechange');

            // 对所有链接进行html5处理
            // $("body").on("click", 'a', function(){
            //     var _$t = $(this);
            //     console.log( _$t.attr('title'), _$t.attr('href'), 'asdfasdfasdfs');
            //     History.pushState({hash: History.getState().hash}, _$t.attr('title'), _$t.attr('href'));
            // });
        },
        //判断是前进还是后退
        hashParse: function(hash){
            var hashArr = [];
                if(!hash){
                    hash1 = null;
                }else{
                    hashArr = hash.split('/');
                }
            var hashObj =  {
                hashArr : hashArr,
                hash1: hashArr[1] || '',
                hash2: hashArr[2] || '',
            };
            console.log(hashObj, 'hashObj');
            return hashObj;
        },

        //解析路由
        //cr CURRENT ROUTE,即对应路由表里面的对象
        //根据hash(层级)返回相应tmpl和ctrl对象
        //页面级跳转url   /#/example1; 
        //页面内跳转hash  /#example2
        hashRouteParse: function(hash){
            var hashObj = helper.hashParse(hash),
                router  = helper.route.router,
                cr      = router['/'+hashObj.hash1], //currentRoute level1 hash
                hash2Name = hashObj.hash2;
            if(!hash2Name){ 
                if(cr && cr.hasOwnProperty('/')){
                    cr = cr['/'];
                }
            }else{
                var hash2 = '/' + hash2Name;
                //level2 hash没有匹配到路由表时, 看是否路由的为变量||ID
                if(!cr[hash2] && cr.hasOwnProperty('/:var')){
                    cr = cr['/:var'];
                    cr.routeParams = hash2Name;
                }else{
                    cr = cr[hash2];
                }
            }
            return cr;
        },
        // 路由到相应页并根据情况初始化页面
        routeTo: function(state){
            var router = helper.route.router,
                cr = helper.hashRouteParse(state.data.hash);
                
                console.log(cr, "----- CURRENT ROUTE! -----");
                if(!cr){
                    //形如 #hash这种路由不作处理(ratchet对此hash作了一些处理)
                    if(!location.hash.indexOf('/')){
                        return;
                    }
                    router['/404']['data'] = {url: location.href};
                    location.hash = '/404';
                    return;
                }
                // cr.go = helper.goOrBack(e.oldURL, e.newURL);
            var crCtrl = cr.ctrl;
                //存在ctrl则初始化页面，否则则直接render页面
                if(crCtrl){
                    crCtrl.init(helper, cr);
                }else{
                    helper.render(cr);
                }
        },
        //页面渲染
        //render 的 cr 即 route配置里的路由指向的对象
        //cr {tmpl, data, title, ...}
        render: function(cr, next){
            var dom, renderToDom;
            if(!cr.tmpl){
                return;
            }
            console.log('/views/'+cr.tmpl+'.html', 'tmpl route');
            $.get('/views/'+cr.tmpl+'.html', function(tmpl){
                dom = cr.data ? template(tmpl)(cr) : template(tmpl); 
                renderToDom = cr.rendeTo;
                renderToDom = renderToDom ? renderToDom : '#body';
                $renderToDom = $(renderToDom);
                PUSH({
                    domContainer: $renderToDom, 
                    domEmpty: $("#body"), 
                    domPush: dom, 
                    effect: (cr.go ? 'swipe-left' : 'swipe-right'),
                    complete: function(){}
                });

                if(cr.title){
                    $('header.bar .title').text(cr.title);
                }

                next ? next(dom) : null;

                helper.reset(cr.tmpl==='404'? 1 : 0);
            });
        },

        goOrBack: function(oldURL, newURL){
            if(!oldURL){
                return 1
            }

            var oldHASH = '#/' + helper.getUrl(oldURL, 'hash'),
                newHASH = '#/' + helper.getUrl(newURL, 'hash'),
                hashArr = helper.hashParse(oldHASH).hashArr,
                hashToArr = helper.hashParse(newHASH).hashArr;
                // console.log(oldHASH, newHASH, hashArr,  hashToArr, "TTTTTTTTT");
            if(hashToArr.length > hashArr.length){
                return 1;
            }else{
                return 0;
            }
        },
        //页面初始化(如果是404页，退二步，因为退到找不到的页面还是会跳转到404)
        reset: function(is404){
            $(helper.config.returnClass).off().click(function(){
                history.go(!is404 ? -1 : -2);
            });
        },
         //1=>URL,
         //2=>传入key,返回value,
        // 传入 'hash' 返回hash名，
        // 传入 'search' 返回kv字符串,
        // 传入 'domain' 返回.com|.net ~~~,
        // 否则返回key:value obj;

        getUrl: function (url, keyOrObj) {
            //对url进行decodeURIComponen解码
            url = decodeURIComponent(url);
            var hashsearch = !~url.indexOf('#') ? '' : url.substr(url.indexOf('#') + 2);
            

            var pos = hashsearch.indexOf('?');
            if (!!~pos) {
                var hash = hashsearch.substr(0, pos),
                    search = hashsearch.substr(pos + 1),
                    kvArr = search.split('&');
            } else {
                var hash = hashsearch,
                    search = '',
                    kvArr = [];
            }

            var kvObj = {};

            for (var i = 0; i < kvArr.length; i++) {
                var kvi = kvArr[i];
                kvObj[kvi.substr(0, kvi.indexOf('='))] = kvi.substr(kvi.indexOf('=') + 1);
            }

            if (typeof keyOrObj === 'string') {
                if (keyOrObj === 'hash') {
                    return hash;
                }
                if (keyOrObj === 'search') {
                    return search;
                }
                if (keyOrObj === 'domain') {
                    var durl = /http:\/\/([^\/]+)\//i,
                    domain = str.match(durl);
                    return domain[1].substr(domain[1].lastIndexOf('.') + 1);
                }
                return kvObj[keyOrObj];
            }

            return kvObj;
        },

        //传入key,value 或 obj,均自动解析
        // serialize| single=Single&multiple=Multiple&multiple=Multiple3&check=check2&radio=radio1
        setUrl: function (url, keyValueOrObj, value) {
            if (typeof keyValueOrObj === 'string') {
                var kvpair = keyValueOrObj + '=' + value;
                if (!~url.indexOf('?')) {
                    return url + '?' + kvpair;
                } else {
                    return url + '&' + kvpair;
                }
            } else if (typeof keyValueOrObj === 'object') {
                var kvpair = $.param(keyValueOrObj);
                if (!~url.indexOf('?')) {
                    return url + '?' + kvpair;
                } else {
                    return url + '&' + kvpair;
                }
            }
        }

    };

    // var opt = {
    //     domContainer : ''
    //     domEmpty: '', 
    //     domPush : '',
    //     effect  : 'slide-in',
    //     complete: function(){}
    // };
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

    return helper;
});