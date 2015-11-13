define(['base/utils/store'], function(store){
    //模板引擎 dot => underscore, doT拥有此功能且性能高
    _.templateSettings = {
        evaluate    : /\{\{(.+?)\}\}/g,
        interpolate : /\{\{=(.+?)\}\}/g,
        escape      : /\{\{\-(.+?)\}\}/g
    };
    /**
     * View对象
     * @namespace
     * @constructs View
     * @return {Object} View
     * @example
     */
    var View = Class.extend({
        init:function(opts){
            this.tmplname   = opts.tmplname  || '';  //模板名称, view的话在route里面配置，partial的话
            this.tmpl = '';                          //模板html,有模板名称则从通过名称取到tmpl;
            this.data   = opts.data || {};
            this.events = opts.events || {};
            this.wrapper = $(opts.wrapper);
            this.construct(opts);
        },
        //new View()时即执行的对象
        construct:function(opts){
            console.log('[VIEW CONSTRUCT RUN WHEN EXTEND VIEW‘S OBJECT HASN’T CONSTRUCT]');
            if(this.events){
                this._parseEvent(opts.ctrl || this);
            }
        },

        //根据STORE与AJAX条件渲染视图,供View.extend的Page UI内部调用
        render: function(){
            var that = this;
            this.getTmpl('partial', function(){
                that.show();
            });
        },

        //显示视图
        show: function (){
            this.wrapper.html(this.getHTMLFragment());
            console.log(this.wrapper, 'this.wrapper');
        },
        //更新视图
        update: function(data){
            if(data){
                this.data = data;
            }
            this.render();
        },
        //销毁视图
        destory: function(){

        },
        //获取带模板数据的virtual dom
        getHTMLFragment: function(){
            if(!this.tmpl) return;
            return this.data ? this.template(this.tmpl)(this) : this.template(this.tmpl);
        },

        //获取STORE与AJAX条件获取模板
        getTmpl: function(type, callback){
            var hasStoreView = this.getStoreTmpl();
            if(hasStoreView){
                callback();
                return;
            }
            this.getAjaxTmpl(type, callback);
        },
        getStoreTmpl: function(){
            var tmpl = store.get(this.tmplname);
            if(tmpl){
                this.tmpl = tmpl;
                return true;
            }
            return false;
        },
        getAjaxTmpl: function(type){
            if(typeof type === 'function'){
               next = type;
            }else{
                type = type || 'view';
                next = arguments[1];
            }
            var that = this,
                baseUrl = (type === 'partial' ? '/lib/ui/' : '/views/');

            $.get(baseUrl + this.tmplname + '.html', function (tmpl) {
                //store.set(that.tmplname, tmpl);
                that.tmpl = tmpl;
                next ? next() : null;
            });
        },
        //重、写_.underscore方式，去支持include语法
        template: function (str, data) {
            // match "<% include template-id %>"
            return _.template(
                str.replace(
                    // /<%\s*include\s*(.*?)\s*%>/g,
                    /\{\{\s*include\s*(.*?)\s*\}\}/g,
                    function(match, templateId) {
                        var el = document.getElementById(templateId);
                        return el ? el.innerHTML : '';
                    }
                ),
                data
            );
        },
        //给组件或页面绑定事件，采用了事件代理的方式
        onview: function(eventType, selector, listener){
            //console.log(this.wrapper, eventType,  selector, listener,  'this.wrapper.$el on event');
            this.wrapper.on(eventType, selector, listener);
            return this;
        },
        offview: function(eventType, selector, listener){
            this.wrapper.off(eventType, selector, listener);
            return this;
        },
        /**
         * events: {
         *   'click,touch selector1,selector2': 'function',
         *   'touch .selecor': 'function2'
         * }
         **/
         //that为事件绑定时的listener所在的执行环境
        _parseEvent: function(env){
            var that = this;
            if(!this.events) return;
            this.offview();
            var events = this.events;
            for(var eve in events){
                (function(eve){
                    var eventSrc = getEventSrc(eve),
                        eventListener = events[eve];
                    that.onview(eventSrc.event, eventSrc.selector, function (e){
                        env[eventListener](e, this);
                        return false;
                    });
                })(eve);
            }
            //如此的话， events触发的listener的this指向 发生动作的元素， e，对原生event对象， 第二个参数this为发生的对象，  eventListener里的this指向that


            function getEventSrc(eve){
                var ret = /(\w+)+\s+(.+)/.exec(eve);
                return {
                    event: ret[1],  //event type 1
                    selector: ret[2],  //event selector all
                };
            }
        }
    });

    return View;
});
