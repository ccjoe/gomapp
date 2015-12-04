define(['base/ui/ui.list'], function(List) {
    'use strict';
    return {
        init: function(page){
            page.render();
            this.createList();
        },
        events: {
          'click .create-list':'createList2'
        },
        createList: function(){
            var viewList = {
                media: 'img', // 'icon'
                list: [{
                    img: 'http://placehold.it/42x42',
                    title: '列表1',
                    desc: '列表1列表1列表1列表1列表1列表1列表1列表1列表1列表1列表1列表1列表1',
                    badge: '12'
                },{
                    title: '组2',
                    isDivider: true,
                    collapse: true
                },{
                    img: '',
                    title: '列表3',
                    desc: '列表1列表1列表1列表1列表1',
                    badge: '10',
                }],
            };

            var ListSet = new List({
                data: viewList,
                wrapper: '#list'
            });
            ListSet.render();
        },
        createList2: function(){
            var viewList = {
                media: 'icon', // 'icon'
                card: true,
                list: [{
                    icon: 'icon-trash',
                    title: '列表1',
                    desc: '列表1列表1列表1列表1列表1列表1',
                    badge: '12'
                },{
                    img: 'icon-gear',
                    title: '组2',
                    isDivider: true,
                    collapse: false
                },{
                    icon: 'icon-pages',
                    title: '列表3',
                    desc: '列表1列表1列表1列表1列表1列表1列表1',
                    badge: '10',
                }],
            };

            var ListSet = new List({
                data: viewList,
                wrapper: '#list2'
            });
            ListSet.render();
        }

    };
});

