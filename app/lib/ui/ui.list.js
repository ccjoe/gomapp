define(['base/core/view'], function(View) {
    var defaultView = {
        media: '', // 'icon'
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
            isDivider: true,
            collapse: true
        }],
    };

    var List = View.extend({
        init: function (opts) {
            $.extend(opts, this);   //将List实例混合到opts上， 去父对象上执行
            opts.tmplname = 'ui.list';
            this._super(opts);
        },
        events: {
            'click .table-view-divider.table-view-collapse': 'collapseListGroup'
        },

        collapseListGroup: function(e, current){
            $(current).next().filter('.table-view-cell').toggle();
        }
    });

    return List;
});
