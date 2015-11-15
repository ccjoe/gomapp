define(['base/ui/ui.modal', 'base/ui/ui.list'], function(Modal, List) {
    'use strict';
    return {
        init: function(page){
            page.render(this.createModal);
        },
        events: {
            'click .loading': 'createLoading',
            'click .confirm': 'createConfirm',
            'click .alert': 'createAlert',
            'click .toast': 'createToast',
            'click .bottom': 'createBottom',
            'click .top': 'createTop',
            'click .tips': 'createTips'
        },
        createAlert: function(){
            var alert = Modal.alert({content: '这是一个测试对话框，这里可以是html'});
        },
        createLoading: function(){
            var loading = Modal.loading().render();
            console.log(loading, 'laoding');
        },
        createConfirm: function(){
            var confirm = Modal.confirm({content: '这是一个测试对话框，这里可以是html'});
        },
        createToast: function(){
            var toastType = $('#toastType').val();
            console.log('选择的是：'+toastType);
            var toast = Modal.toast('这是toast信息', toastType);
        },
        createBottom: function(){
            var viewList = {
                list: [{
                    title: '列表1',
                    desc: '列表1列表1列表1列表1列表1列表1列表1列表1列表1列表1列表1列表1列表1',
                }
                ,{
                    title: '列表3',
                    desc: '列表1列表1列表1列表1列表1列表1列表1列表1列表1列表1列表1列表1列表1',
                }],
            };

            var ListSet = new List({
                data: viewList,
                //wrapper: '#list2'
            });
            var cont = ListSet.render();
            console.log(ListSet, cont, 'CONTENT');
            var bottom = Modal.bottom({ content: cont});
        },
        createTop: function(){
            var top = Modal.top({title:'这是标题'});
        },
        createTips: function(){
            var tips = Modal.tips({title:'这是标题'});
        }
    };
});
