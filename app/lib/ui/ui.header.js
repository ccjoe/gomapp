define(['base/core/view'], function(View) {
    var Header = function (opts) {
        View.call(this, opts.tmpl, opts.data, opts.wrapper || opts.config.selector.header);
        this.title = opts.title;
    };

    Header.prototype = new View();
    Header.prototype = $.extend(Header.prototype, {


    });

    return Header;
});
