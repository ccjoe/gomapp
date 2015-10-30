/**
 * Created by sfliu on 2015/10/28.
 */
define(function() {
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

    var core = {
        config: {
            animate: false,     // animate: 是否开启动画
            iscroll: false,     //iscroll: 是否开启iscroll
            html5history: true
        },
        route: {},              //相关路由表对象，详细定义参考route.js
        init: function(){       //App初始化
            var isHistoryApi = !!(window.history && history.pushState);
            if(!isHistoryApi){
                return;
            }

            History.Adapter.bind(window, 'statechange', routeState);
            History.Adapter.trigger(window, 'statechange');

            function routeState(){
                var state = History.getState();
                state.hashName = core.getHashByState(state);
                console.log(state,  'state');
                core.routeTo(state.hashName);
            }

            //$(window).on('onpopstate', routeState).trigger('onpopstate');

            //对所有链接进行html5处理
             $("body").on("click", 'a', function(){
                 var $t = $(this), hash =  $t.attr('href').substring(1);
                 History.pushState({hash: hash}, $t.attr('title'), '?'+hash);
                 core.routeTo(hash);
                 return false;
             });
        },
        getHashByState: function (state) {
            var pos = state.hash.indexOf('?');
            return (pos!==-1) ? state.hash.substring(0, pos) : pos;
        },
        //将带 /  a/b 或 a/b/3 的hash解析成route可识别的对象
        hashParse: function(hash){
            console.log(hash, '传入的');
            var hashObj = {};
            if(!hashObj){
                hashObj.hash1 = void 0;
            }else{
                if(hash  === '/'){
                    hashObj.hash1 = '/'
                }else{
                    hashArr = hash.split('/');
                    hashObj.hash1 = hashArr[0];
                    hashObj.hash2 = hashArr[1];
                }
            }
            return  hashObj;
        },

        //解析路由
        //cr CURRENT ROUTE,即对应路由表里面的对象
        //根据hash(层级)返回相应tmpl和ctrl对象
        //页面级跳转url   /#/example1;
        //页面内跳转hash  /#example2
        hashRouteParse: function(hash){
            var hashRoute = core.hashParse(hash),
                router  = core.route.router,
                cr      = router[hashRoute.hash1], //currentRoute level1 hash
                hash2 = hashRoute.hash2;
            console.log(hashRoute, "----- CURRENT HASH! -----");
            if(!hash2){
                if(cr && cr.hasOwnProperty('/')){
                    cr = cr['/'];
                }
            }else{
                var hash2 = '/' + hash2;
                //level2 hash没有匹配到路由表时, 看是否路由的为变量||ID
                if(!cr[hash2] && cr.hasOwnProperty('/:var')){
                    cr = cr['/:var'];
                    cr.routeParams = hash2;
                }else{
                    cr = cr[hash2];
                }
            }
            return cr;
        },
        // 路由到相应页并根据情况初始化页面
        routeTo: function(hash){
            var router = core.route.router,
                cr = core.hashRouteParse(hash);
            console.log(cr, "----- CURRENT ROUTE! -----");
            if(!cr){
                router['404']['data'] = {url: location.href};
                location.hash = '/404';
                return;
            }
            var crCtrl = cr.ctrl;
            //存在ctrl则初始化页面，否则则直接render页面
            if(crCtrl){
                crCtrl.init(core, cr);
            }else{
                core.render(cr);
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
                var dom = cr.data ? template(tmpl)(cr) : template(tmpl),
                    renderToDom = cr.rendeTo ? cr.rendeTo : '#body',
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

                //core.reset(cr.tmpl==='404'? 1 : 0);
            });
        },

        goOrBack: function(oldURL, newURL){
            if(!oldURL){
                return 1
            }

            var oldHASH = '#/' + core.getUrl(oldURL, 'hash'),
                newHASH = '#/' + core.getUrl(newURL, 'hash'),
                hashArr = core.hashParse(oldHASH).hashArr,
                hashToArr = core.hashParse(newHASH).hashArr;
            // console.log(oldHASH, newHASH, hashArr,  hashToArr, "TTTTTTTTT");
            if(hashToArr.length > hashArr.length){
                return 1;
            }else{
                return 0;
            }
        },
        //页面初始化(如果是404页，退二步，因为退到找不到的页面还是会跳转到404)
        reset: function(is404){
            $(core.config.returnClass).off().click(function(){
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

            var hash,search,kvArr;
            if (!!~pos) {
                    hash = hashsearch.substr(0, pos);
                    search = hashsearch.substr(pos + 1);
                    kvArr = search.split('&');
            } else {
                    hash = hashsearch;
                    search = '';
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
            var kvpair;
            if (typeof keyValueOrObj === 'string') {
                kvpair = keyValueOrObj + '=' + value;
                if (!~url.indexOf('?')) {
                    return url + '?' + kvpair;
                } else {
                    return url + '&' + kvpair;
                }
            } else if (typeof keyValueOrObj === 'object') {
                kvpair = $.param(keyValueOrObj);
                if (!~url.indexOf('?')) {
                    return url + '?' + kvpair;
                } else {
                    return url + '&' + kvpair;
                }
            }
        }
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
    return core;
});
