define(['View'], function(View) {
    var defaults = {
        media: '', // 'icon'
        card: false, //false
        list: [{
            img: '',
            title: '',
            content: '',
            badge: ''
        },{
            img: '',
            title: '',
            content: '',
            badge: '',
            isDivider: true,
            collapse: true
        }]
    };

    $.fn.nextAll = function(selector){
        var next = this.next(), $a = next;
        while (next.is(selector)){
            $a = $a.add(next);
            next = next.next();
            if (next.length == 0) break;
        }
        return $a;
    };
    /**
     * @class Gom.UI.List
     * @alias List
     * @extends {Gom.View}
     */
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
            $(current).nextAll('.table-view-cell').toggle();
        }
    });

    return List;
});
