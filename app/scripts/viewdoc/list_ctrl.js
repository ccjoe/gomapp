define(['base/ui/ui.list'], function(List) {
    'use strict';
    return {
        init: function(page){
            page.render(this.createList);
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
                    img: '',
                    title: '列表2',
                    desc: '列表2列表2列表2列表2列表2列表2列表2列表2列表2列表2列表2列表2列表2',
                    badge: '11',
                    isDivider: true
                },{
                    img: '',
                    title: '列表3',
                    desc: '列表 ——列表 ——列表 ——列表 ——列表 ——列表 ——列表 ——列表 ——列表 ——列表 ——列表 ——列表 ——列表 ——',
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
                list: [{
                    icon: 'icon-trash',
                    title: '列表1',
                    desc: '列表1列表1列表1列表1列表1列表1列表1列表1列表1列表1列表1列表1列表1',
                    badge: '12'
                },{
                    img: 'icon-gear',
                    title: '列表2',
                    desc: '列表2列表2列表2列表2列表2列表2列表2列表2列表2列表2列表2列表2列表2',
                    badge: '11',
                    isDivider: true
                },{
                    icon: 'icon-pages',
                    title: '列表3',
                    desc: '列表 ——列表 ——列表 ——列表 ——列表 ——列表 ——列表 ——列表 ——列表 ——列表 ——列表 ——列表 ——列表 ——',
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

