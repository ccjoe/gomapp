define(['base/ui/ui.list', 'base/ui/ui.sides'], function(List, Sides) {
    'use strict';
    var data = '上面的列表是组件渲染方式，这里的文本数据是页面渲染的部分, GoM分页面渲染和ui组件渲染，其都继承于View对象,都有data属性，通过定义组织data，然后调用render方法可以实现不同的渲染方式';

    var viewList = {
        media: 'img', // 'icon'
        list: [{
            isDivider: true,
            title: '文档页面',
            collapse: true
        },{
            title: 'viewdoc(UI)',
            desc: 'UI组件相关使用实例及文档描述【组件层】',
            hash: '?viewdoc',
            badge: 5,
            img: ''
        },{
            title: 'pagedoc',
            desc: '页面文档及相关【视图层】',
            hash: '?pagedoc',
            img: ''
        },{
            title: 'modeldoc',
            desc: '页面文档及相关【模型层】',
            hash: '?modeldoc',
            img: ''
        },{
            isDivider: true,
            title: '公用页面',
            collapse: true
        }, {
            title: '404',
            desc: '404页面',
            hash: '?404',
            icon: 'gear'
        },{
            title: '500',
            desc: '500页面',
            hash: '?500',
            icon: 'gear'
        }]
    };
    var ListSet = new List({
        data: viewList
        //wrapper: '#indexList'     //有wrapper时直接渲染，否则返回fragmentHTML
    }).render();

    var main =  {
        init: function(page) {
            page.data = data;  //页面的tmpl与data生成的页面
            page.render(this.initCtrl);    //this.sides页面渲染后回调生成ui组件组成的页面
        },

        initCtrl: function(){
            main.mainList();
            var header = $('#header').data('widget'); //声明式初始组件可以采用这种方法获取实例对象
            header.onview('click', '.icon-bars', function(){
                main.showSides('left');
            });
        },

        mainList: function() {
            $('#indexList').html(ListSet);
        },

        setSides: function(pos){
            var sidesDesc = $('#sidesDesc').html(); //页面上的内容只有page.render后才能获取到, 所以在main外是获取不到的

            this.side = new Sides({data:{position: pos}}).render();
            this.side.content = sidesDesc + ListSet;
            this.side.setContent();
            var that = this;
            this.side.wrapper.off('click', 'a').on('click', 'a', function(){
                var $t = $(this);
                if($t.hasClass('close')){
                    that.side.hide();
                }

                if($t.hasClass('left')){
                    that.setSides('left');
                }

                if($t.hasClass('right')){
                    that.setSides('right');
                }
                return;
            });
        },
        //左右侧边栏
        showSides: function(pos){
            var side = $('#sides').find('.sides');
            if(!side.length){
                this.setSides('left');
            }else{
                if(this.side.showed){
                    this.side.hide();
                }else{
                    this.side.show();
                }
            }
            return;
        },

    };
    return main;
});
