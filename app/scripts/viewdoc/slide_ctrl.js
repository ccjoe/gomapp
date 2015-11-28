define(['base/ui/ui.slide'], function(Slide) {
    'use strict';
    return {
        init: function(page){
            var that = this;
            page.render(function(){
                that.textSlide('vertical');
            });
        },
        //todo events文档,  events支持值为function直接量, 双向切换
        events: {
            'click .slide-change': 'textSlide'
        },
        textSlide: function(direction){
            direction = typeof direction === 'string' ?  direction : 'horizontal';
            var slide = new Slide({
                wrapper: '.slide-example',
                data: {
                    direction: direction,    //vertical horizontal
                    list:[{
                        content: 'content1, 点击切换为水平滚动, <button class="slide-change">切换</button>'
                    },{
                        content: 'content2'
                    },{
                        content: 'content3'
                    }]
                }
            }).render();
            //console.log(slide, 'slide');
        }
    };
});

