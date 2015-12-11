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
                content: '[list, scroll]<br/>各种列表的实现',
                icon: 'icon-pages'
            },
            modal:{
                title: 'modal',
                hash: '?viewdoc/modal',
                content: '[alert, confirm, loading, toast, bottom, top, center, popover]<br/>弹出层相关，包含对话框，确认框， top/bottom弹出， loading, toast',
                icon: 'icon-pages'
            },
            switch:{
                title: 'switch',
                hash: '?viewdoc/switch',
                content: '[slide, swipe, tab]<br/>实现横向纵向滚动切换,图片文本等slide效果,swipe的实现,tab 等',
                icon: 'icon-pages'
            },
            scroll:{
                title: 'scroll',
                hash: '?viewdoc/scroll',
                content: '[scroll, time-select, date-select]<br/>实现横向纵向滚动,图片文本scroll效果等',
                icon: 'icon-pages'
            },
            form:{
                title: 'form各组件',
                content: '[select]<br/>包含form各组件',
                hash: '?viewdoc/form',
                icon: 'icon-compose'
            },
            button:{
                title: 'button',
                content: '[button, components]<br/>包含按钮的(或组件类)的三种声明方式',
                hash: '?viewdoc/button',
                icon: 'icon-search'
            },
            icon:{
                title: 'icons',
                content: '[icon] <br/> 在组件中data下有icon属性的，其值仅需要为icon-iconname作为class值',
                hash: '?viewdoc/icon',
                icon: 'icon-right'
            },
            swipe:{
                title: 'swipe插件',
                content: '[swipe, swipe-left, swipe-right, swipe-top, swipe-bottom] <br/>  slide的实现原理，实现各种滑动',
                hash: '?pluginsdoc/swipe',
                icon: 'icon icon-star-filled'
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
