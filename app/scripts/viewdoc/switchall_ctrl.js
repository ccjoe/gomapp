define(['base/ui/ui.slide'], function(Slide) {
    'use strict';
     var ctrl = {
        init: function(page){
            var that = this;
            page.render();
            this.textSlide();
        },
        //todo events文档,  events支持值为function直接量, 双向切换
        events: {
            'click .slide-change-vertical': function(e, targe){
                ctrl.textSlide('slide-vertical');
            },
            'click .slide-change-horizontal': function(e, targe){
                ctrl.textSlide('slide-horizontal');
            },
            'click .slide-change-tabtop': function(){
                ctrl.textSlide('tab-top');
            },
            'click .slide-change-tabbottom': function(){
                ctrl.textSlide('tab-bottom');
            }
        },
        textSlide: function(direction){
            direction =  direction || 'slide-horizontal';
            var slide = new Slide({
                wrapper: '.slide-example',
                data: {
                    type: direction,    //vertical horizontal
                    list:[{
                        title: '街景',
                        icon: 'icon-home',
                        content: '<img src="./images/demo/slide3.jpeg"><p class="slide-guide">点击切换为"垂直滚动", <button class="btn btn-positive slide-change-vertical">垂直滚动</button></p>'
                    },{ title: '美女',
                        icon: 'icon-person',
                        content: '<img src="./images/demo/slide1.jpeg"><p class="slide-guide">点击切换为"水平滚动", <button class="btn btn-positive slide-change-horizontal">水平滚动</button></p>'
                    },{ title: '巴黎',
                        icon: 'icon-star-filled',
                        content: '<img src="./images/demo/slide2.jpeg"><p class="slide-guide">点击切换为"TabTop滚动", <button class="btn btn-positive slide-change-tabtop">Tab滚动</button></p>、'
                    },{ title: '巴黎',
                        icon: 'icon-gear',
                        content: '<img src="./images/demo/slide2.jpeg"><p class="slide-guide">点击切换为"TabBottom滚动", <button class="btn btn-positive slide-change-tabbottom">Tab滚动</button></p>、'
                    }]
                }
            }).render();
            console.log(slide, 'slide');
        }
    };

    return ctrl;
});

