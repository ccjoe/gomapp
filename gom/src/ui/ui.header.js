define(['View'], function(View) {
    /**
     * @default
     * @prop {object} left
     * @prop {string} left.type     -Header左侧内容类型,可选有 icon, button, link
     * @prop {string} left.text     -Header左侧内容文本，相应的为icon|button|link的文本
     * @prop {string} left.icon     -Header左侧内容图标class,当left.type为icon时才具体此属性
     * @prop {object} right         -Header右侧,其子属性同left
     * @prop {string} title         -主标题
     * @prop {string} subtitle      -副标题
     */
    var defaults = {
        left:{
            type: 'icon'   //options button,link
        },
        right:{
            type: 'icon',
            icon: 'icon-bars'
        },
        title: '',
        subtitle: ''
    };
    /**
     * @class Gom.UI.Header
     * @alias Header
     * @extends {Gom.View}
     */
    var Header = View.extend({
        init: function (opts) {
            opts.data = _.extend({}, defaults, opts.data);
            opts.tmplname = 'ui.header';
            opts.wrapper = opts.wrapper || opts.config.selector.header;
            $.extend(opts, this);   //将List实例混合到opts上， 去父对象上执行
            this._super(opts);
            this.title = opts.title;
        },
        setTitle: function(text){
            this.data.title = text;
            this.update();
        },
        events: {
            'click .icon-left-nav': 'goBack',
            //'click .icon-bars': 'showSides'
        },
        //showSides: function(){
        //    new UI.Sides({data:{position: 'left'}}).render();
        //},
        goBack: function(){
            History.go(-1);
            return;
        }
    });

    return Header;
});
