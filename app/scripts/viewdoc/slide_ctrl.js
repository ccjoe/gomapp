define(['base/ui/ui.slide'], function(Slide) {
    'use strict';
    return {
        init: function(page){
            page.render(this.textSlide);
        },
        textSlide: function(){
            var slide = new Slide({
                wrapper: '.slide-example',
                data: {}
            }).render();
            console.log(slide, 'slide');
        }
    };
});

