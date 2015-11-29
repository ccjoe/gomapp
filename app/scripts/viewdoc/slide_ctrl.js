define(['base/ui/ui.slide'], function(Slide) {
    'use strict';
     var ctrl = {
        init: function(page){
            var that = this;
            page.render(this.textSlide);
        },
        //todo events文档,  events支持值为function直接量, 双向切换
        events: {
            'click .slide-change': function(e, targe){
                ctrl.textSlide('vertical');
            }
        },
        textSlide: function(direction){
            direction =  direction || 'horizontal';
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

    return ctrl;
});

