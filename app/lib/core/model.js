define(['base/ui/ui.modal'], function(Modal){
    var loading;
    //要达到的设定有：
    //支持实际场景不跨域开发跨域时的配置 devCrossDomain: true(CROS)
    //支持 jsonp与ajax的一键切换开发模式，当模式变化时，前端可以快速反应
    //支持 header, data, cookie相关数据传输
    //支持 ajax injector， 在ajax request与response处可以统一处理。

    //默认Ajax截击器
    var defaultInject = {
        request: function(e, xhr, options){
            console.log(e, xhr, options, 'default request inject');
        },
        response: function(e, xhr, options){
            console.log(e, xhr, options, 'default response inject');
        }
    };

    //从外部自定义Ajax截击器
    var modelInject = $.extend({}, defaultInject);
    //如果有外部Ajax截击器则均触发，否则仅触发默认;
    var inject = function(req, res){

        modelInject.request = function(e, xhr, options){
            defaultInject.request(e, xhr, options);
            req(e, xhr, options);
        };

        modelInject.response = function(e, xhr, options){
            defaultInject.response(e, xhr, options);
            res(e, xhr, options);
        };
    };

    //全局处理

    $.ajaxSettings.timeout = 1000 * 60; //默认超时时间为1分钟
    $.ajaxSettings.error = function(xhr, errorType) {
        if (errorType === 'timeout') {
            Modal.toast('信号偏弱，访问超时', 'error');
        } else if (errorType === 'error') {
            var statusCode = xhr.status;
            if (statusCode === 404 || statusCode === 500) {   //处理状态码错误
                //window.location.href = '?' + statusCode;
            }
        }
    };

    $(document).on('ajaxBeforeSend', function(e, xhr, options){
        modelInject.request(e, xhr, options);
        loading = Modal.loading();
    }).on('ajaxComplete', function(e, xhr, options){
        modelInject.response(e, xhr, options);
        loading.toggleModal('Out');
    });

    /**
     * Model分构造函数与方式调用二种调用，
     * 其用处为构造函数时用于构造Modal的ajax封装，用法为 new Model(opts);
     * 为方式时作为ajax拦截注入器注入request与response, 用法为 Model({req:function(){}, res: function(){}});
     * @param {object} opts 参列或 opts.req, opts.res
     */
    var Model = Class.extend({
        init: function(opts){
            //如果为注入器，仅执行注入操作，不实例化Model;
            if(opts.req || opts.res){
                inject(opts.req, opts.res);
                return;
            }
            this.url = '';
            this.data = data;
        },
        /**
         * 一般用于post保存数据
         */
        save: function(){

        },
        /**
         * 一般用于get获取数据
         */
        fetch: function(){

        },
        /**
         *
         */
        changed: function(props){

        }
    });

    return Model;
});
