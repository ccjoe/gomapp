define(['base/core/view'], function(View) {
    /**
     * @default
     * @prop position left, right
     * @prop content, sides的内容
     */
    var defaultForm = {
        position: 'left',   //left or right
        content: ''         // string or html
    };

    var Form = View.extend({
        init: function (opts) {
            opts.data = _.extend({}, defaultBtn, opts.data);
            opts.tmplname = 'ui.sides';
            opts.wrapper = opts.wrapper || '#sides';
            $.extend(opts, this);   //将List实例混合到opts上， 去父对象上执行
            this._super(opts);
        },

    });

    return Form;
});
