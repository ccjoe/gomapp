define(['base/ui/ui.list', 'base/ui/ui.sides'], function(List, Sides) {
    'use strict';
    var data = '上面的列表是组件渲染方式，这里的文本数据是页面渲染的部分, gom分页面渲染和ui组件渲染，其都继承于View对象,都有data属性，通过定义组织data，然后调用render方法可以实现不同的渲染方式';

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
        },{
            title: 'pagedoc',
            desc: '页面文档及相关【视图层】',
            hash: '?pagedoc'
        },{
            title: 'modeldoc',
            desc: '页面文档及相关【模型层】',
            hash: '?modeldoc'
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

    return {
        init: function(page) {
            page.data = data;  //页面的tmpl与data生成的页面
            page.render(this.mainList);    //this.sides页面渲染后回调生成ui组件组成的页面
        },
        events:{

        },
        //左右侧边栏
        mainList: function() {
            $('#indexList').html(ListSet);
        },
        sides: function(){
            var side = new Sides({

            });
            //var ListSet = new List({
            //    data: viewList,
            //    wrapper: '#indexList'
            //});
            //ListSet.render();
        }
    };
});
