define(['base/utils/ps'], function(ps){
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
            if(this.tmplname){
                ps.add(this.tmplname);  //新增发布者
                this.isrender.sub(this.tmplname);
            }
            //this.render();
        },
        //创建实图，尚未插入, 发布一个状态。 ui.create
        render: function(){
            var that = this;
            this.getViewFragment('partial', function(vdom){
                that.tmpl = vdom;
                ps.send(that.tmplname, that);
            });
        },

        isrender: function(name, that){
            if(that.tmplname = name){
                that.show();
                //ps.del(that.tmplname); //  删除发布者
                console.log(ps, 'ps');
            }
        },
        //显示视图 ＝》render前update this.date,或update this.tmpl即可刷新视图
        show: function (){
            if(!this.tmpl) return;
            var vdom = this.data ? this.template(this.tmpl)(this) : this.template(this.tmpl);
            this.wrapper.html(vdom);
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
        /**
         * 获取代码片断或页面视图并绑定数据后的DOM Fragment
         * @method Page#PUSH
         * @param {string} type|next 获取的html为'partial || view'的模板, type为function时为回调
         * @options {function} callback
         **/
        getViewFragment: function(type){
            if(typeof type === 'function'){
               next = type;
            }else{
                type = type || 'view';
                next = arguments[1];
            }
            var that = this,
                baseUrl = (type === 'partial' ? '/lib/ui/' : '/views/');
            $.get(baseUrl + this.tmplname + '.html', function (tmpl) {
                var vdom = that.data ? that.template(tmpl)(that) : that.template(tmpl);
                next ? next(vdom) : null;
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
