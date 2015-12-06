define(['base/ui/ui.list', 'base/ui/ui.scroll'], function(List, Scroll) {
    'use strict';
    var scrollX;
    return {
        init: function(page){
            page.render();
            var hashs = page.hashs;
            if(hashs.length === 2){
                this.showList();
            }else{
                if(hashs[hashs.length-1] === 'xy'){
                    this.showScrollX();
                }
            }
        },
        events:{
            'click .btn-top': function(e, current, that){
                scrollX.scrollTo('top');
            },
            'click .btn-bottom': function(e, current, that){
                scrollX.scrollTo('bottom');
            },
            'click .btn-num': function(e, current, that){
                scrollX.scrollTo(-300);
            },
            'click .btn-elem': function(e, current, that){
                scrollX.scrollTo($('.here'));
            }
        },
        showList: function(){
            var viewList = {
                list: [{
                    title: '水平或垂直滚动页面',
                    hash: '?viewdoc/scroll/xy'
                },{
                    title: '弹层滚动',
                    desc: '弹出的区域滚动',
                    hash: '?viewdoc/scroll/modal'
                },{
                    title: '弹层底部滚动',
                    desc: '指定src的slide子项示例, 将通过ajax获取模板',
                    hash: '?viewdoc/scroll/bottom'
                }]
            };

            var ListSet = new List({
                data: viewList,
                wrapper: $('.content').last()
            });
            ListSet.render();
        },
        showScrollX: function(){
            scrollX = new Scroll({
                 wrapper    : '.scroll-example2',    //滚动对象所在的容器
                 className  : '.scroll-content',      //滚动对象的className
                 direction  : 'vertical',             //水平与垂直
                 step       : 100, // 步长
                 //outer:       允许出界的范围
                 //outerFront  允许出界位置上面显示的html或文字
                // outerEnd  允许出界位置下面显示的html或文字
                 onScroll: function(point){ },    //每次滚动时回调
                 endScroll: function(point){ console.log('单次滚动结束'); }, //   每次滚动停回调
                 onTop: function(){ console.log('滚动到最上面，滚动停止时触发')},       //滚动到上时
                 onBottom:  function(){ console.log('滚动到最下面，滚动停止时触发')}   // 滚动到下时
            });
        }
    };
});

