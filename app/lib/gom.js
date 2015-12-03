/*
 * Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */

//@todo config ref by everywhere
(function(){
    var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
    this.Class = function(){};
    Class.extend = function(prop) {
        var _super = this.prototype;
        initializing = true;
        var prototype = new this();
        initializing = false;
        for (var name in prop) {
            prototype[name] = typeof prop[name] == "function" &&
            typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                (function(name, fn){
                    return function() {
                        var tmp = this._super;
                        this._super = _super[name];
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;
                        return ret;
                    };
                })(name, prop[name]) :
                prop[name];
        }
        function Class() {
            if ( !initializing && this.init )
                this.init.apply(this, arguments);
        }
        Class.prototype = prototype;
        Class.prototype.constructor = Class;
        Class.extend = arguments.callee;
        return Class;
    };
})();

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}

define(['base/core/page', 'base/utils/url'], function(Page, Url){
    /**
     * Gom对象
     * @namespace
     * @constructs Gom
     * @return {Object} Gom
     * @example
     * new Gom(config, route); 传入配置文件与路由文件
     */
    var Gom = Class.extend({
        init: function (config, route) {
            this.config = config || {};
            this.route = route || {};
            this.model = {};
            this.history = [];
        },
        run: function(){       //Gom初始化
            var that = this;
            var isHistoryApi = !!(window.history && history.pushState);
            if(!isHistoryApi){
                return;
            }

            History.Adapter.bind(window, 'statechange', function(e){
                var state = History.getState();
                state.data.hash = state.data.hash || '/';
                that._routeByHash(state.data.hash);
            });
            History.Adapter.trigger(window, 'statechange');

            this.initHref();
        },
        initHref: function(){
            //对所有链接进行html5处理
            //@todo 需要处理为智能判断Url与绝对、相应地址
            //? 站内链接跳转
            //# 站内组件或hash跳转
            //http:// 站间跳转
            //''为空时当作非链接处理
            var that = this;
            $("body").off().on("click", 'a', function(){
                var $t = $(this),
                    href = $t.attr('href');
                if(!href || !!~href.indexOf('#')) return; //无链接或hash跳转不处理
                var hash =  href.substring(1);
                History.pushState({hash: hash, prevHash: that.getPrevHash()}, $t.attr('title'), '?'+hash);
                return false;
            }).on('click', '.icon-left-nav', function(){
                History.go(-1);
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
         * @method Gom#getPageSets
         * @return {object} CRO (Current Router Object)返回具体路由指向的路由表对象
         * @example ?module/list  ?module/123
         */
        getPageSets: function (hashPath) {
            var hashRoute = Url.getHashPath(hashPath, true),
                router = this.route;

            if (hashPath === '/') {
                return router[hashPath];
            }

            var hash1 = hashRoute[0],
                hash2 = hashRoute[1];

            var CRO = router['/' + hash1];

            //console.log(hashPath, hashRoute, CRO, 'hashinfo');
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
         * @method Gom#goto
         * @example module/list  module/123
         * * ? 站内链接跳转
         * # 站内组件或hash跳转(仅页面内)
         * http(s)://或// 站间跳转 判断是否本域,本域的话跳转到search部分
         * @todo 页面间数据传递
         */
        goto: function(where){
            var isstr = typeof where === 'string';
            if(isstr){
                var urls = Url.get(where);
                var isThisHost = urls.host+urls.port === location.host;
                if(/^(https:)?\/\//.test(where)){
                    if(!isThisHost){
                        location.href = where;
                        return;
                    }else{
                        where = Url.getHashPath(urls.search);   //获取serach里的path部分
                    }
                }
            }
            this[isstr ? '_routeByHash' : '_routeByCRO'](where);
        },

        /**
         * 根据完整hash路由到页面
         * @method Gom#_routeByHash
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

            var ctrl = CRO.ctrl;
            if(ctrl){
                CRO.events = ctrl.events;   //将ctrl的事件设置到当前路由对象
            }
            var page = this.setPage(CRO);   //初始页面并绑定事件
            if(ctrl && ctrl.init){
                ctrl.init(page);
            }else{
                page.render();
            }
            //console.log( CRO, page, "----- CURRENT ROUTE! -----");
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
            //console.log(history, 'THIS HISTORY');
        },
        //从倒数位置index取历史hash
        getLastHashByLastIndex: function(index){
            var history = this.history;
            return history[history.length-index];
        },
        isBack: function(){
            var oldHashArr = Url.getHashPath(this.getLastHashByLastIndex(2), true),
                newHashArr = Url.getHashPath(this.getLastHashByLastIndex(1), true);
            //console.log(_.compact(oldHashArr), _.compact(newHashArr),   'IS GO OR BACK');
            return _.compact(newHashArr).length < _.compact(oldHashArr).length;
        },
        //判断是否存在CRO而404
        isRouteNotFound: function(CRO){
            if (!CRO) {
                this.route['/404']['data'] = {Url: location.href};
                this.goto('404');
                return true;
            }
            return false;
        }
    });
    Gom.version =  '1.0.0';
    Gom.isWebApp = /http(s)?:\/\//.test(location.protocol);
    return Gom;
});
