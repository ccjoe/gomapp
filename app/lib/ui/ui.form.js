define(['base/core/view'], function(View) {
    /**
     * @default
     * @prop position left, right
     * @prop content, sides的内容
     */
    var defaultForm = {
    };

    var Form = View.extend({
        init: function (opts) {
            opts.data = _.extend({}, defaultForm, opts.data);
            opts.tmplname = 'ui.form';
            $.extend(opts, this);   //将List实例混合到opts上， 去父对象上执行
            this._super(opts);
        }
    });

    var Toggle = View.extend({
        init: function (opts) {
            opts.data = _.extend({}, opts.data);
            opts.tmplname = 'ui.toggle';
            $.extend(opts, this);   //将List实例混合到opts上， 去父对象上执行
            this._super(opts);
        }
    });

    return {
        Form: Form,
        Toggle: Toggle
    };
});
