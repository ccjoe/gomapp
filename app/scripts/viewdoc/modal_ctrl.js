define(['base/ui/ui.modal'], function(Modal) {
    'use strict';
    return {
        init: function(page){
            page.render(this.createModal);
        },
        events: {
            'click .loading': 'createLoading',
            'click .confirm': 'createConfirm',
            'click .alert': 'createAlert',
            'click .toast': 'createToast'
        },
        createAlert: function(){
            var alert = Modal.alert({content: '这是一个测试对话框，这里可以是html'});
            alert.render();
        },
        createLoading: function(){
            var loading = Modal.loading();
            loading.render();
        },
        createConfirm: function(){
            var confirm = Modal.confirm({content: '这是一个测试对话框，这里可以是html'});
            confirm.render();
        },
        createToast: function(){
            var toastType = $('#toastType').val();
            console.log('选择的是：'+toastType);
            var toast = Modal.toast(toastType, '这是toast信息');
            toast.render();
        }

    };
});

