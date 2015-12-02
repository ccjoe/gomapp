define(['base/ui/ui.list'], function(List) {
    'use strict';
    return {
        init: function(page){
            page.render();
            this.showList();
        },
        events: {
            'click .create-list':'showList'
        },
        showList: function(){
            var viewList = {
                list: [{
                    title: 'Slide示例',
                    desc: '包含滑动轮播图slide-vertical, slide-horizontal示例',
                    hash: '?viewdoc/switch/all'

                },{
                    title: 'Tab示例',
                    desc: 'Tab与slide结合包含Ttab-top, tab-bottom示例'
                },{
                    title: 'Switch item指定src',
                    desc: '指定src的slide子项示例'
                },{
                    title: 'Switch统合示例',
                    desc: '实现各种Switch切换'
                }]
            };

            var ListSet = new List({
                data: viewList,
                wrapper: '.content'
            });
            ListSet.render();
        }
    };
});

