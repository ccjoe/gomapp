/**
 *  Model AJAX 核心
 */
define(['com/config'], function(Config) {
    'use strict';

    var url = Config.url, SVC = {};

    $.ajaxSettings.timeout = 1000 * 60; //默认超时时间为1分钟
    $.ajaxSettings.xhrFields = {
        withCredentials: true   //带上认证信息(如 cookie)
    };
    $.ajaxSettings.error = function(xhr, errorType) {
        if (errorType === 'timeout') {
            Dailog.error('信号偏弱，访问超时');
        } else if (errorType === 'error') {
            var statusCode = xhr.status;
            console.log(statusCode, 'statusCode');
            if (statusCode === 404 || statusCode === 500) {   //处理状态码错误
                window.location.href = '#/' + statusCode;
            }
        }
    };

    //restful 接口
    ['get','post','put','delete'].forEach(function(method){
        SVC[method] = function(api, params, handlerSuc, handlerFail, handlerErr){
            $.ajax({
                url : url + api,
                data: params,
                type: method.toUpperCase(),
                success: function(res) {
                    if(res.code === Config.successCode){
                        if(handlerSuc){
                            handlerSuc(res.data);
                        }else{
                            require('com/ctrl').msg(res.msg);
                        }
                    }else{
                        if(handlerFail){
                            handlerFail(res);
                        }else{
                            require('com/ctrl').msg(res.msg);
                        }
                    }
                },
                error: handlerErr ? handlerErr : function(){}
            });
        };
    });

    return SVC;
});
