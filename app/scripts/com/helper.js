define(function(require) {
    var Config = require('com/config'), 
        Route = require('com/route');

    var helper = {
        //App初始化
        init: function(){
            $(window).on('hashchange', helper.router).trigger('hashchange');
        },
        //cr CURRENT ROUTE,即对应路由表里面的对象
        //根据hash(层级)返回相应tmpl和ctrl对象
        hashRouteParse: function(hash){
            var hashArr = hash.split('/'),
                router = Route.router,
                cr = {}; //currentRoute

            var hash1 = '/' + (hashArr[0] ? hashArr[0] : ''),
                hash2 = '';
                cr = router[hash1]; //level1 hash

            if(hashArr.length <= 1){ 
                //level1 hash时路由至 /#/test的 '/' 对象
                if(cr && cr.hasOwnProperty('/')){
                    cr = cr['/'];
                }
            }else{
                hash2 = '/' + hashArr[1];
                //level2 hash没有匹配到路由表时, 看是否路由的为变量||ID
                if(!cr[hash2] && cr.hasOwnProperty(':var')){
                    cr = cr[':var'];
                    cr.routeParams = hashArr[1];
                }else{
                    cr = cr[hash2];
                }
            }
            console.log(cr, "----------Current Route!------------");
            return cr;  
        },
        // 路由到相应页并根据情况初始化页面
        router: function(){
            var hash = location.hash.substring(2),
                cr = helper.hashRouteParse(hash);
                
                if(!cr){
                    location.hash = '/404';
                    return;
                }

            var crCtrl = cr.ctrl;
                //存在ctrl则初始化页面，否则则直接render页面
                if(crCtrl){
                    crCtrl.init(helper, cr);
                }else{
                    helper.render(cr);
                }
        },
        //页面渲染
        //render 的 obj即 route配置里的路由指向的对象
        //obj {tmpl, data, title, ...}
        render: function(obj, next){
            var dom, renderToDom;
            if(!obj.tmpl){
                return;
            }
            $.get('views/'+obj.tmpl+'.html', function(tmpl){
                dom = obj.data ? _.template(tmpl, obj.data) : tmpl;
                renderToDom = obj.rendeTo;
                $(renderToDom ? renderToDom : '#content').html(dom);
                
                if(obj.title){
                    $('header.bar .title').text(obj.title);
                }

                next ? next(dom) : null;

                helper.reset();
            });
        },

        //页面初始化
        reset: function(){
            $(Config.returnClass).click(function(){
                history.back();
            });
        }
    }

    helper.init();

    return helper;
});