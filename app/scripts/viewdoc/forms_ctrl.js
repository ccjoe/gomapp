define(['Forms', 'District'], function(Forms, District) {
    'use strict';

    return {
        init: function(page){
            page.render();
            this.createToggles();
            this.createInputLocation();
        },
        createToggles: function(){
            new Forms.Toggle({
                wrapper: '.toggle-wrapper',
                data: {
                    name: "xqx",
                    content: ['声明式', '函数式']
                }
            }).render();
        },
        createInputLocation: function(){
            new Forms.InputLocation({
                wrapper: '.input-location',
                data:{
                    name:　'position'
                }
            }).render();
        },
        showDistrict: function(){
            District();
        }
    };
});
