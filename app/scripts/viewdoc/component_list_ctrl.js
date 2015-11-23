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
            slide:{
                title: 'slide',
                hash: '?viewdoc/slide',
                desc: '实现横向纵向滚动,图片文本等slide效果',
                icon: 'icon-pages'
            },
            button:{
                title: 'button',
                hash: '?viewdoc/button'
            },
            tips:{
                title: 'tips',
                hash: '?viewdoc/tips'
            },
            scroll:{
                title: 'scroll',
                hash: '?viewdoc/scroll'
            },
            switch:{
                title: 'switch',
                hash: '?viewdoc/switch'
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
            page.render(function(){
                new List({
                    data: viewList,
                    wrapper: '.component-list'
                }).render();
            });
        }
    };
});
