define(['base/core/view'], function(View) {
    var defaultView = {
        media: 'img', // 'icon'
        card: false, //false
        list: [{
            img: '',
            title: '',
            desc: '',
            badge: ''
        },{
            img: '',
            title: '',
            desc: '',
            badge: '',
            isDivider: true
        }],
    };

    var List = View.extend({
        init: function (opts) {
            opts.data = opts.data;
            opts.tmplname = 'ui.list';
            opts.wrapper = opts.wrapper;
            this._super(opts);
        },

        event: {

        }
    });

    return List;
});
