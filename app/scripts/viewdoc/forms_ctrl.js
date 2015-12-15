define(['Toggle', 'InputLocation'], function(Toggle, InputLocation) {
    'use strict';

    return {
        init: function(page){
            page.render();
            this.createToggles();
            this.createInputLocation();
        },
        createToggles: function(){
            new Toggle({
                wrapper: '.toggle-wrapper',
                data: {
                    content: ['声明式', '函数式']
                }
            }).render();
        },
        createInputLocation: function(){
            new InputLocation({
                wrapper: '.input-location'
            }).render();
        }
    };
});

