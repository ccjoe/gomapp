define(['base/ui/ui.header'], function(Header) {
    'use strict';
    return {
        init: function(page){
            var that = this;
            page.render(function(){
                that.bindEvent();
            });
        },

        bindEvent: function(){
            var that = this;
            $('.header-create').click(that.createHeader);
        },

        createHeader:function(){
            var header = new Header({
                data: {
                    title: '新头部',
                },
                wrapper: '#header'
            });
            header.render();
            $('.header-settitle').click(function(){
                console.log(123);
                header.setTitle('setTitle设置的标题');
            });

        }

    };
});

