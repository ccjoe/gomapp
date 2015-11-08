define(['base/ui/ui.layout'], function(Layout) {
    'use strict';
    return {
        init: function(page){
            page.render(this.createLayout);
        },
        events: {
            'click .loading': 'createLoading'
        },
        createLayout: function(){

        },
        createLoading: function(){
            var loading = new Layout.layout({
                data: {},
                wrapper: '#Layout'
            });
            loading.render();
        }
    };
});

