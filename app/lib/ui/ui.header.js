define(['base/core/view'], function(View) {
    var defaultHeader = {
        left:{
            type: 'icon',   //options button,link
            text: '返回',
        },
        right:{
            type: 'button', // icon link
            text: 'Help'
        },
        title: '设置header',
        subtitle: '2015.11.05起'
    };
    var Header = function (opts) {
        opts.data = _.extend({}, defaultHeader, opts.data);
        opts.tmpl = 'ui.header';
        View.call(this, opts.tmpl, opts.data, opts.wrapper || opts.config.selector.header);
        this.title = opts.title;
    };

    Header.prototype = new View();
    return Header;
});
