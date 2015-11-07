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
            this.event = void 0;
            this.wrapper = $(opts.wrapper);
            this.construct();
        },
        //new View()时即新增发布对象，render订阅此对象
        construct:function(){
            console.log('VIEW CONSTRUCT RUN WHEN EXTEND VIEW‘S OBJECT HASN’T CONSTRUCT');
        },

        //根据STORE与AJAX条件渲染视图,供View.extend的Page UI内部调用
        render: function(){
            var that = this;
            this.getTmpl('partial', function(){
                that.show();
                //ps.send(that.tmplname, that);
            });
        },

        //显示视图
        show: function (){
            this.wrapper.html(this.getHTMLFragment());
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
                store.set(that.tmplname, tmpl);
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
        /**
         * events: {
         *   'click,touch selector1,selector2': 'function',
         *   'touch .selecor': 'function2'
         * }
         **/
        _parseEvent: function(){
            if(!this.events) return;
            for(var event in events){
                var eventType = deal(event),
                    eventFn = events[event];
            }

            function getEventASelector(){
                ///\s/
            }

        }
    });

    return View;
});
