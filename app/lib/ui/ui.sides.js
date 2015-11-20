define(['base/core/view'], function(View) {
    var defaultBtn = {
        position: 'left',  //left or right
        effect: 'slide'
    };

    var Button = View.extend({
        init: function (opts) {
            opts.data = _.extend({}, defaultBtn, opts.data);
            opts.tmplname = 'ui.sides';
            opts.replace = true;
            $.extend(opts, this);   //将List实例混合到opts上， 去父对象上执行
            this._super(opts);
        }
    });

    return Button;
});
