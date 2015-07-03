define(function(require) {
    'use strict';
    var indexData = [{
                item: '404',
                hash: '404',
                icon: 'gear'
            },{
                item: '500',
                hash: '500',
                icon: 'gear'
            },{
                item: 'list （列表页示例）',
                hash: 'module',
                icon: 'pages'
            },{
                item: '分步表单',
                hash: 'module/add',
                icon: 'pages'
            },{
                item: 'login （登录页示例）',
                hash: 'login',
                icon: 'pages'
            },{
                item: '模态窗口',
                hash: 'modal',
                icon: 'pages'
            },{
                item: 'Slide',
                hash: 'slide',
                icon: 'pages'
            }];

    return {
        init: function(helper, cr) {
            cr.data = indexData
            helper.render(cr);
        },

        login: function() {

        },

        logout: function() {

        }
    };
});
