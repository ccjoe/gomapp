define(['base/ui/ui.list'], function(List) {
    'use strict';
    var indexData = [
        {
            name: 'viewdoc(UI)',
            hash: 'viewdoc'
        },{
            name: 'pagedoc',
            hash: 'pagedoc'
        },{
            name: 'modeldoc',
            hash: 'modeldoc'
        },{
            name: 'list （列表页示例）',
            hash: 'module',
            icon: 'pages'
        }
        /*{
                item: '404',
                hash: '404',
                icon: 'gear'
            },{
                item: '500',
                hash: '500',
                icon: 'gear'
            },*/

      /*  ,{
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
            },
        {
                item: 'Slide',
                hash: 'slide',
                icon: 'pages'
            }*/];

    return {
        init: function(page) {
            page.data = indexData;
            page.render(this.side);
        },

        side: function() {
            var viewList = {
                media: 'img', // 'icon'
                list: [{
                    isDivider: true,
                    title: '文档相关',
                    collapse: true
                },{
                    title: 'viewdoc(UI)',
                    desc: 'UI组件相关使用实例及文档描述【组件层】',
                    hash: '?viewdoc',
                    badge: 5,
                },{
                    title: 'pagedoc',
                    desc: '页面文档及相关【视图层】',
                    hash: '?pagedoc'
                },{
                    title: 'modeldoc',
                    desc: '页面文档及相关【模型层】',
                    hash: '?modeldoc'
                }],
            };

            var ListSet = new List({
                data: viewList,
                wrapper: '#indexList'
            });
            ListSet.render();
        }
    };
});
