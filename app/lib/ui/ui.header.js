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
            opts.wrapper = opts.wrapper || opts.config.selector.header
            this.title = opts.title;
            this._super(opts);
        },
        setTitle: function(text){
            this.data.title = text;
            this.update();
        },
        event: {

        }
    });

    return Header;
});
