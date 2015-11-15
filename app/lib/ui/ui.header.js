define(['base/core/view'], function(View) {
    var defaultHeader = {
        left:{
            type: 'icon',   //options button,link
            //text: '返回',
        },
        right:{
            type: 'button', // icon link
            text: 'Help'
        },
        title: '设置header',
        subtitle: '2015.11.05起'
    };
    var Header = View.extend({
        init: function (opts) {
            opts.data = _.extend({}, defaultHeader, opts.data);
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
            'click .icon-left-nav': 'goBack'
        },
        goBack: function(){
            console.log(123);
            History.go(-1);
            return;
        }
    });

    return Header;
});
