/**
 *  Model AJAX 核心
 */
define(['com/config'], function(Config) {
    'use strict';

    var url = Config.url;

    $.ajaxSettings.timeout = 1000 * 60; //默认超时时间为1分钟
    $.ajaxSettings.xhrFields = {
        withCredentials: true //跨域 在老版本浏览器中不支持，并且导致AJAX出错
    };
    $.ajaxSettings.error = function(xhr, errorType, error) {
        if (errorType == "timeout") {
            Dailog.error("信号偏弱，访问超时");
        } else if (errorType == "error") {
            var statusCode = xhr.status;
            if (statusCode === 404 || statusCode === 500) {   //处理状态码错误
                window.location.href = '#/' + statusCode;
            }
        }
    };

    var query = function(api, param, method) {
        return $.ajax({
                url: url + api,
                data: param,
                type: method
            })
            .then(function(data) {
                return JSON.parse(data);
            });
    };

    return {
        get : query(api, param, "GET"),
        post: query(api, param, "POST")
    }
});
