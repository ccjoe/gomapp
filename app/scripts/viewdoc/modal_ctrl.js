    define(['UI'], function(UI) {
        var Modal = UI.Modal;
        var List = UI.List;
    'use strict';
    return {
        init: function(page){
            this.page = page;   //给其它方法公用到page对象
            page.render();
        },
        events: {
            'click .loading': 'createLoading',
            'click .preload': 'preload',
            'click .confirm': 'createConfirm',
            'click .alert': 'createAlert',
            'click .toast': 'createToast',
            'click .center': 'createCenter',
            'click .bottom': 'createBottom',
            'click .popup': 'popup',
            'click .top': 'createTop',
            'click .tips': 'createTips',
            'click .popover, .popover-top, .popover-bottom': 'popIt'
        },
        createAlert: function(){
            Modal.alert({content: '这是一个测试对话框，这里可以是html',
                onYes: function(){
                    Modal.toast('点击了确定');
                }});
        },
        createLoading: function(){
            Modal.loading().render();
        },
        preload: function(){
            $('.preload-wrapper').show();
            var preload = Modal.loading(false, '.preload-wrapper', 0.8).render();
            //preload.remove();
        },
        createConfirm: function(){
            Modal.confirm({content: '这是一个测试对话框，这里可以是html',
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
            Modal.bottom({title: '请看列表', content: cont,
                onYes: function(){
                    Modal.toast('点击了确定');
                },
                onNo: function(){
                    Modal.toast('点击了取消');
                }});
        },
        popup: function(){
            Modal.popup({title: 'POPUP弹出', content: '<p class="content-padded">这里写些什么呢?</p>',
                onYes: function(){
                    Modal.toast('点击了确定');
                }});
        },
        createTop: function(){
            Modal.top({title:'一般用作通知吧', content: '显示在头部的内容或html,没有关闭项？自动定义去吧'});
        },
        popIt: function(e, current){
            Modal.popover({bindElem: current, content:'<ul class="table-view">\
            <li class="table-view-cell loading"><a class="navigate-right">Loading</a></li>\
            <li class="table-view-cell confirm"><a class="navigate-right">confirm</a></li>\
            <li class="table-view-cell alert"><a class="navigate-right">alert</a></li>\
            <li class="table-view-cell center"><a class="navigate-right">center</a></li>\
            <li class="table-view-cell top"><a class="navigate-right">modal top</a></li>\
            <li class="table-view-cell bottom"><a class="navigate-right">modal bottom</a></li>\
            <li class="table-view-cell popover"><a class="navigate-right">modal popover</a></li>\
            <li class="table-view-cell toast"><a class="navigate-right">modal toast</a></li>\
            </ul>'});
            //将此页面上的事件events事件整体打包添加到modal-layout上，这个要深挖代码才能体会
            this.page.refreshEvent('.modal-layout', this);
        },
        createTips: function(e, current){
            Modal.tips({bindElem: current, content: '小提示的内容很多很多很多很多很多很多的时候呢?'});
        }
    };
});

