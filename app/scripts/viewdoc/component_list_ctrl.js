define(['base/ui/ui.list'], function(List) {
    'use strict';

    var viewList = {
        media: 'icon', // 'icon'
        list:{
            header: {
                title: 'header头部设置',
                hash: '?viewdoc/header',
                icon: 'icon-pages'
            },
            list: {
                title: '列表设置',
                hash: '?viewdoc/list',
                desc: '各种列表的实现',
                icon: 'icon-pages'
            },
            modal:{
                title: 'modal',
                hash: '?viewdoc/modal',
                desc: '弹出层相关，包含对话框，确认框， top/bottom弹出， loading, toast',
                icon: 'icon-pages'
            },
            switch:{
                title: 'switch',
                hash: '?viewdoc/switch',
                desc: '实现横向纵向滚动,图片文本等slide效果,swipe的实现,tab 等',
                icon: 'icon-pages'
            },
            button:{
                title: 'button',
                desc: '包含按钮的(或组件类)的三种声明方式',
                hash: '?viewdoc/button',
                icon: 'icon-pages'
            },
            swipe:{
                title: 'swipe插件',
                desc: 'slide的实现原理，实现各种滑动',
                hash: '?pluginsdoc/swipe',
                icon: 'icon icon-star-filled'
            },
            tips:{
                title: 'tips',
                hash: '?viewdoc/tips'
            },

            tab:{
                title: 'tab',
                hash: '?viewdoc/tab'
            },
            radio:{
                title: 'radio',
                hash: '?viewdoc/radio'
            },
            select:{
                title: 'select',
                hash: '?viewdoc/select'
            },
            footer:{
                title: 'footer设置',
                hash: '?viewdoc/footer'
            }
        }
    };
    return {
        init: function(page){
            page.data = viewList;
            page.render();

            new List({
                data: viewList,
                wrapper: '.component-list'
            }).render();
        }
    };
});
