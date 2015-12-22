    define(['UI'], function(UI) {
        var Modal = UI.Modal;
        var List = UI.List;
    'use strict';
    return {
        init: function(page){
            page.render();
        },
        events: {
            'click .loading': 'createLoading',
            'click .confirm': 'createConfirm',
            'click .alert': 'createAlert',
            'click .toast': 'createToast',
            'click .center': 'createCenter',
            'click .bottom': 'createBottom',
            'click .top': 'createTop',
            'click .tips': 'createTips'
        },
        createAlert: function(){
            var alert = Modal.alert({content: '这是一个测试对话框，这里可以是html',
                onYes: function(){
                    Modal.toast('点击了确定');
                }});
        },
        createLoading: function(){
            var loading = Modal.loading().render();
        },
        createConfirm: function(){
            var confirm = Modal.confirm({content: '这是一个测试对话框，这里可以是html',
                    onYes: function(){
                        Modal.toast('点击了确定');
                    },
                    onNo: function(){
                        Modal.toast('点击了取消');
                    }}
            );
        },
        createToast: function(){
            var toastType = $('#toastType').val();
            console.log('选择的是：'+toastType);
           Modal.toast('这是toast信息', toastType);
        },
        createCenter: function(){
            Modal.center({title: '中间弹出层', content: '骚年,举起你的双手，来创造一个对话框，OK?'});
        },
        createBottom: function(){
            var viewList = {
                list: [{
                    title: '列表1',
                    content: '列表1列表1列表1列表1列表1列表1列表1列表1列表1列表1列表1列表1列表1',
                }
                ,{
                    title: '列表3',
                    content: '列表1列表1列表1列表1列表1列表1列表1列表1列表1列表1列表1列表1列表1',
                }]
            };

            var ListSet = new List({
                data: viewList,
                //wrapper: '#list2'
            });
            var cont = ListSet.render();
            var bottom = Modal.bottom({title: '请看列表', content: cont,
                onYes: function(){
                    Modal.toast('点击了确定');
                },
                onNo: function(){
                    Modal.toast('点击了取消');
                }});
        },
        createTop: function(){
            var top = Modal.top({title:'这是标题'});
        },
        createTips: function(){
            var tips = Modal.tips({title:'这是标题'});
        }
    };
});

