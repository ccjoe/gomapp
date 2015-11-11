define(['base/ui/ui.modal'], function(Modal) {
    'use strict';
    return {
        init: function(page){
            page.render(this.createModal);
        },
        events: {
            'click .loading': 'createLoading',
            'click .confirm': 'createConfirm',
            'click .alert': 'createAlert'
        },
        createAlert: function(){

        },
        createLoading: function(){
            var loading = Modal.loading();
            console.log(loading, 'loading');
            loading.render();
        },
        createConfirm: function(){
            var confirm = Modal.confirm('这是一个测试对话框，这里可以是html');
            confirm.render();
        }
    };
});

