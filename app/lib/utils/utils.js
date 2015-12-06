define(['base/utils/store'], function(Store) {
    var Utils = {};
    var expires = 1000*60*0.02; //5min 过期时间，后面将从config.js配置里获取;
    //模板引擎 dot => underscore, doT拥有此功能且性能高
    _.templateSettings = {
        evaluate    : /\{\{(.+?)\}\}/g,
        interpolate : /\{\{=(.+?)\}\}/g,
        escape      : /\{\{\-(.+?)\}\}/g
    };

    //重、写_.underscore方式，去支持include语法
    Utils.template = function (str, data) {
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

    //异步获取组件模板,保证仅请求一次, 有则从Store里获取，否则异步;
    var getPartialTmplStatus = 'init';  //初始
    //（tmplId, callback） || (callback)
    Utils.getPartialTmpl = function (tmplID, callback){
        if(getPartialTmplStatus === 'loading') return;
        if(typeof tmplID === 'function'){
            callback = tmplID;
        }else{
            var tmpl = Store.get('tmplID');
            if(tmplID && !!tmpl){
                callback?callback(tmpl):null;
                return;
            }
        }

        getPartialTmplStatus = 'loading';   //正请求async: false,
        return $.ajax({url:'lib/ui/ui.html', dataType:'html', success: function (tmpl){
            getPartialTmplStatus = 'finished';  //已完成
            var tmpls = $(tmpl).find("script"), itemTmplID, itemTmpl;
            tmpls.prevObject.each(function(i, item){
                itemTmplID = item.id; itemTmpl = $(item).html();
                if(!!itemTmplID){
                    //Store.set(itemTmplID, itemTmpl, expires);
                }
                if(tmplID === itemTmplID){
                    callback ? callback(itemTmpl) : null;
                }
            });
            //Store.set('GOM_APP_UI', 1, expires);
            //console.log('Ajax get and Store has set');
            if(typeof tmplID === 'function'){
                console.log(callback, 'callback');
                callback ? callback() : null;
            }
        }});
    };
    //异步获取页面模板,保证仅请求一次
    Utils.getViewTmpl = function(tmplname, callback){
        var view = Store.get('tmplname');
        if(!!view){
            callback?callback(view):null;
            return;
        }
        $.ajax({url:'/views/'+tmplname+'.html', dataType:'html', success: function (tmpl){
            //Store.set(tmplname, tmpl, expires);
            callback?callback(tmpl):null;
        }});
    }

    return Utils;
});
