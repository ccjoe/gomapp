define(function(){
    //模板引擎 dot => underscore, doT拥有此功能且性能高
    _.templateSettings = {
        evaluate    : /\{\{(.+?)\}\}/g,
        interpolate : /\{\{=(.+?)\}\}/g,
        escape      : /\{\{\-(.+?)\}\}/g
    };
    /**
     * View对象
     * @namespace
     * @constructs App
     * @return {Object} App
     * @example
     * new App(config, route); 传入配置文件与路由文件
     * event: {
     *   'click,touch selector1,selector2', 'function'
     * }
     */
    var View = function(tmpl, data, wrapper){
        this.tmpl   = tmpl  || '';
        this.data   = data || {};
        this.event = void 0;
        this.wrapper = wrapper;
    };

    View.prototype = {
        init: function(){
            this.render();
        },
        //render前update this.date即可刷新视图
        render: function (next){
            var dom = this.data ? this.template(this.tmpl)(this) : this.template(this.tmpl),
                $wrapperDom = this.wrapper ? $(this.wrapper) : $('#body');
            $wrapperDom.html(dom);
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
        },
        /**
         * 获取代码片断或页面视图并绑定数据后的DOM Fragment
         * @method Page#PUSH
         * @param {string} type|next 获取的html为'partial || view'的模板, type为function时为回调
         * @options {function} callback
         **/
        getDomFrag: function(type){
            if(typeof type === 'function'){
               next = type;
            }else{
                type = type || 'view';
                next = arguments[1];
            }
            var that = this,
                baseUrl = (type === 'partial' ? '../ui/' : '/views/');
            $.get(baseUrl + this.tmpl + '.html', function (tmpl) {
                var dom = that.data ? that.template(tmpl)(that) : that.template(tmpl);
                next ? next(dom) : null;
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
        _passeEvent: function(){
            if(!this.events) return;
            for(var event in events){
                var eventType = deal(event),
                    eventFn = events[event];
            }

            function getEventASelector(){
                ///\s/
            }

        },
    }
    ;

    return View;
});
