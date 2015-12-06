define(['base/ui/ui.list', 'base/ui/ui.scroll', 'base/ui/ui.modal'], function(List, Scroll, Modal) {
    'use strict';
    var scrollXY;
    return {
        init: function(page){
            page.render();
            var hashs = page.hashs;
            if(hashs.length === 2){
                this.showList();
            }else{
                var lastHash = hashs[hashs.length-1];
                if(lastHash === 'x'){
                    this.showScrollX();
                }else if(lastHash === 'y'){
                    this.showScrollY();
                }
            }
        },
        events:{
            'click .btn-top': function(e, current, that){
                scrollXY.scrollTo('top');
            },
            'click .btn-bottom': function(e, current, that){
                scrollXY.scrollTo('bottom');
            },
            'click .btn-num': function(e, current, that){
                scrollXY.scrollTo(-300);
            },
            'click .btn-elem': function(e, current, that){
                scrollXY.scrollTo($('.here'));
            },
            'click a[href="?viewdoc/scroll/modal"]': function(e, current, that){
                that.showModalScroll();
            }
        },
        showList: function(){
            var viewList = {
                list: [{
                    title: '水平滚动页面',
                    hash: '?viewdoc/scroll/x'
                },{
                    title: '垂直滚动页面',
                    hash: '?viewdoc/scroll/y'
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
        showScrollY: function(){
            scrollXY = new Scroll({
                 wrapper    : '.scroll-example2',    //滚动对象所在的容器
                 className  : '.scroll-content',      //滚动对象的className
                 direction  : 'vertical', //'vertical',             //水平与垂直
                 step       : 0, // 不设置步长
                 //outer:       允许出界的范围
                 outerFront : '允许出界位置上面显示的html或文字',
                 outerEnd   : '允许出界位置下面显示的html或文字',
                 onScroll: function(point){ },    //每次滚动时回调
                 endScroll: function(point){ console.log('单次滚动结束'); }, //   每次滚动停回调
                 onTop: function(){ console.log('滚动到最上面，滚动停止时触发')},       //滚动到上时
                 onBottom:  function(){ console.log('滚动到最下面，滚动停止时触发')}   // 滚动到下时
            });
        },
        showScrollX: function(){
            scrollXY = new Scroll({
                 wrapper    : '.scroll-example2',    //滚动对象所在的容器
                 className  : '.scroll-content',      //滚动对象的className
                 direction  : 'horizontal', //'vertical',             //水平与垂直
                 step       : $('.scroll-example2').width(), // 步长
                 outer      : 50,  //允许出界的范围
                 //outerFront  允许出界位置上面显示的html或文字
                // outerEnd  允许出界位置下面显示的html或文字
                 onScroll: function(point){ },    //每次滚动时回调
                 endScroll: function(point){ console.log('单次滚动结束'); }, //   每次滚动停回调
                 onTop: function(){ console.log('滚动到最上面，滚动停止时触发')},       //滚动到上时
                 onBottom:  function(){ console.log('滚动到最下面，滚动停止时触发')}   // 滚动到下时
            });
        },
        showModalScroll: function(){
            Modal.center(
                '<div class="scroll-mdoal-example">\
                    <div class="scroll-mdaol-content">\
                        我的内容能滚动吗？我的内容能滚动吗？我的内容能滚动吗？我的内容能滚动吗？我的内容能滚动吗？我的内容能滚动吗？\
                        我的内容能滚动吗？我的内容能滚动吗？我的内容能滚动吗？我的内容能滚动吗？我的内容能滚动吗？我的内容能滚动吗？\
                        我的内容能滚动吗？我的内容能滚动吗？我的内容能滚动吗？我的内容能滚动吗？我的内容能滚动吗？我的内容能滚动吗？\
                        我的内容能滚动吗？我的内容能滚动吗？\
                        我的内容能滚动吗？我的内容能滚动吗？我的内容能滚动吗？我的内容能滚动吗？我的内容能滚动吗？我的内容能滚动吗？\
                        我的内容能滚动吗？我的内容能滚动吗？我的内容能滚动吗？我的内容能滚动吗？我的内容能滚动吗？我的内容能滚动吗？\
                        我的内容能滚动吗？我的内容能滚动吗？我的内容能滚动吗？我的内容能滚动吗？我的内容能滚动吗？我的内容能滚动吗？\
                        我的内容能滚动吗？我的内容能滚动吗？\
                        我的内容能滚动吗？我的内容能滚动吗？我的内容能滚动吗？我的内容能滚动吗？我的内容能滚动吗？我的内容能滚动吗？\
                        我的内容能滚动吗？我的内容能滚动吗？我的内容能滚动吗？我的内容能滚动吗？我的内容能滚动吗？我的内容能滚动吗？\
                        我的内容能滚动吗？我的内容能滚动吗？我的内容能滚动吗？我的内容能滚动吗？我的内容能滚动吗？我的内容能滚动吗？\
                        我的内容能滚动吗？我的内容能滚动吗？\
                    </div>\
                </div>');

            new Scroll({
                wrapper    : '.scroll-mdoal-example',    //滚动对象所在的容器
                className  : '.scroll-mdaol-content',      //滚动对象的className
            });

        }
    };
});

