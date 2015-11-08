define(['base/ui/ui.header'], function(Header) {
    'use strict';
    var page = {};
    return {
        //会被框架自动调用
        init: function(page){
            var that = this;
            page.render();
        },
        events: {
            'click .header-create': 'createHeader',
            'click .header-settitle': 'setTitle'
        },

        createHeader:function(){
            var header = new Header({
                data: {
                    title: '新头部',
                },
                wrapper: '#header'
            });
            header.render();
            page.header = header;
        },
        setTitle: function(){
            console.log('执行多少次');
            page.header.setTitle('setTitle设置的标题');
        }

    };
});

