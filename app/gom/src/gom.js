/*
 * Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
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
$(function() {
    FastClick.attach(document.body);
});
(function(){
    var GOM_PATH, $MAIN_SCRIPT = $('script[data-gom-path]');
    GOM_PATH = $MAIN_SCRIPT.length ?
        ($MAIN_SCRIPT.attr('data-gom-path') || $MAIN_SCRIPT[0].src.match(/(.+)gom\.js/)[1]) : //直接引入依赖
        config.GOM_PATH.substring(0, config.GOM_PATH.lastIndexOf('gom'));                     //requirejs引入依赖

    console.log(GOM_PATH, 'GOM_PATH');
    requirejs.config({
        paths:{
            Gom:    GOM_PATH + 'gom',
            App:    GOM_PATH + 'core/app',
            View:   GOM_PATH + 'core/view',
            Page:   GOM_PATH + 'core/page',
            Service:GOM_PATH + 'core/service',

            UI :    GOM_PATH + 'ui/ui',
            Forms : GOM_PATH + 'ui/ui.forms',
            Header: GOM_PATH + 'ui/ui.header',
            List:   GOM_PATH + 'ui/ui.list',
            Modal:  GOM_PATH + 'ui/ui.modal',
            Sides:  GOM_PATH + 'ui/ui.sides',
            Scroll: GOM_PATH + 'ui/ui.scroll',
            Slide:  GOM_PATH + 'ui/ui.slide',
            Select: GOM_PATH + 'ui/ui.select',

            District:GOM_PATH+ 'ui/business/ui.select-district',

            Store:  GOM_PATH + 'utils/store',
            Url:    GOM_PATH + 'utils/url',
            Fx:     GOM_PATH + 'utils/fx',
            Swipe:  GOM_PATH + 'utils/swipe',
            Utils:  GOM_PATH + 'utils/utils',
            UITmpl: GOM_PATH + 'ui/ui.tmpl'
        }
    });
})();

define('Gom', ['Service', 'Page', 'View', 'UI', 'Utils', 'App'], function(Service, Page, View, UI, Utils, App){
       /**
     * Gom对象
     * @class Gom
     * @desc
     * A. 引入框架文件如下：（其中data-gom-path用来指定gom文件的路径，值为空时会自动判断,有值时为需要指定绝对完整的绝对路径值）
     * <script src="gom/src/gom.js" data-gom-path></script>
     * B. Gom下有如下模块：App，Service, View, Page, UI, 其中UI模块包含一些UI组件的模块。
     * ```
     * GOM
     *    ---App
     *    ---Service
     *    ---View
     *    ---Page
     *    ---UI
     *          ---Button
     *          ---Header
     *          ---List
     *          ---……等等
     * ```
     * 引入模块的二种方式：
     * 1.通过注入Gom模块,然后通过对象层级引用如Gom.ModuleName 或 Gom.UI.ComponentsName
     * 2.直接引入ComponentName(如Button)
     */
    var Gom = {
        Service:Service,
        Page:   Page,
        View:   View,
        UI:     UI,
        Utils: Utils,
        App:    App,
    };
    return Gom;
});
