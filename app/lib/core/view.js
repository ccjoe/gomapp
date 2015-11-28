define(['base/utils/store'], function(store){
    //模板引擎 dot => underscore, doT拥有此功能且性能高
    _.templateSettings = {
        evaluate    : /\{\{(.+?)\}\}/g,
        interpolate : /\{\{=(.+?)\}\}/g,
        escape      : /\{\{\-(.+?)\}\}/g
    };

    //重、写_.underscore方式，去支持include语法
    var template = function (str, data) {
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
    };

    var getPartialTmplStatus = 'init';  //初始
    var getPartialTmpl = function (callback){
        if(getPartialTmplStatus === 'loading'){
            return;
        }
        getPartialTmplStatus = 'loading';   //正请求
        $.ajax({url:'lib/ui/ui.html', dataType:'html', async: false, success: function (tmpl){
            getPartialTmplStatus = 'finished';  //已完成
            var tmpls = $(tmpl).find("script"), tmplID;
            tmpls.prevObject.each(function(i, item){
                tmplID = item.id;
                if(!!tmplID){
                    store.set(tmplID, $(item).html());
                }
            });
            callback ? callback() : null;
        }});
    };
    getPartialTmpl();
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
            this.events = opts.events || {};          // 对象上的events对象仅适用于此对象的wrapper元素内的事件绑定
            this.wrapper = $(opts.wrapper);
            this.replace = opts.replace || false;                    //是否替换原标签
            this.construct(opts);
        },
        //new View()时即执行的对象
        construct:function(opts){
            //console.log('this is', this, '[VIEW CONSTRUCT RUN WHEN EXTEND VIEW‘S OBJECT HASN’T CONSTRUCT]');
            if(this.events){
                this._parseEvent(opts.ctrl || this);
            }
        },

        //根据STORE与AJAX条件渲染视图,供View.extend的Page UI内部调用, 有wrapper时直接插入到页面，否则返回HTMLFragment,但是能返回的前提是，view是同步的
        render: function(){
            var that = this, frag;
            this.getTmpl('partial', function(){
                frag = that.getHTMLFragment();
                if(that.wrapper){
                    that.replace ? that.wrapper.replaceWith(frag) : that.wrapper.html(frag);
                }
                that.show();
            });
            return that.wrapper.length ? that : frag;
        },

        show: function (){
            //this.wrapper.removeClass('hide');
        },

        //更新视图
        update: function(data){
            if(data){
                this.data = $.extend({}, this.data, data);
            }
            this.render();
        },
        //销毁视图
        destory: function(){
            this.wrapper.empty();
        },
        //获取带模板数据的virtual dom
        getHTMLFragment: function(){
            if(!this.tmpl) return;
            return this.data ? template(this.tmpl)(this) : template(this.tmpl);
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
            var that = this;

            if(type === 'view'){
                $.get('/views/'+this.tmplname+'.html', function (tmpl) {
                    store.set(that.tmplname, tmpl);
                    that.tmpl = tmpl;
                    next ? next() : null;
                });
                return;
            }
            //如果是获取组件模板，则先整体获取，再通过store获取;
            if(type === 'partial'){
                getPartialTmpl(function(){
                    that.getStoreTmpl();
                    next();
                });
            }
        },
        //给组件或页面绑定事件，采用了事件代理的方式
        onview: function(eventType, selector, listener){
            this.wrapper.on(eventType, selector, listener);
            return this;
        },
        offview: function(eventType, selector, listener){
            this.wrapper.off(eventType, selector, listener);
            return this;
        },
        //当没有wrapper时，render返回fragmentHTML,没有绑定事件，当fragmentHTML插入document后，可以调用此方法绑定固有事件
        refreshEvent: function(){
            //this.wrapper =  //@todo如何找到 fragmentHTML 被插入的多个位置并重新绑定事件
            //this._parseEvent(this);
        },
        /**
         * @param {object} env env为事件绑定时的listener所在的执行环境,为ctrl或View, UI-widget
         * events: {
         *   'click,touch selector1,selector2': 'function',
         *   'touch .selecor': 'function2'
         * }
         * function有二个参数 (e, item),其this指向所在的环境即env
         **/
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
