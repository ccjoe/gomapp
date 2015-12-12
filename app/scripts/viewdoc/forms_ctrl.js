define(['Toggle'], function(Toggle) {
    'use strict';

    return {
        init: function(page){
            page.render();
            this.createToggles();
        },
        createToggles: function(){
            new Toggle({
                wrapper: '.toggle-wrapper',
                data: {
                    content: ['声明式', '函数式']
                }
            }).render();
        }
    };
});

