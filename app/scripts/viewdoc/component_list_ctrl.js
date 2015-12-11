define(['UI'], function(UI) {
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
                content: '各种列表的实现',
                icon: 'icon-pages'
            },
            modal:{
                title: 'modal',
                hash: '?viewdoc/modal',
                content: '弹出层相关，包含对话框，确认框， top/bottom弹出， loading, toast',
                icon: 'icon-pages'
            },
            switch:{
                title: 'switch',
                hash: '?viewdoc/switch',
                content: '实现横向纵向滚动切换,图片文本等slide效果,swipe的实现,tab 等',
                icon: 'icon-pages'
            },
            scroll:{
                title: 'scroll',
                hash: '?viewdoc/scroll',
                content: '实现横向纵向滚动,图片文本scroll效果等',
                icon: 'icon-pages'
            },
            button:{
                title: 'button',
                content: '包含按钮的(或组件类)的三种声明方式',
                hash: '?viewdoc/button',
                icon: 'icon-pages'
            },
            swipe:{
                title: 'swipe插件',
                content: 'slide的实现原理，实现各种滑动',
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

            new UI.List({
                data: viewList,
                wrapper: '.component-list'
            }).render();
        }
    };
});
