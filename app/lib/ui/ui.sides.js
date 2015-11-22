define(['base/core/view'], function(View) {
    var defaultBtn = {
        position: 'left',   //left or right
        effect: 'slide',
        content: ''         // string or html
    };

    var Sides = View.extend({
        init: function (opts) {
            opts.data = _.extend({}, defaultBtn, opts.data);
            opts.tmplname = 'ui.sides';
            opts.wrapper = opts.wrapper || '#sides';
            $.extend(opts, this);   //将List实例混合到opts上， 去父对象上执行
            this._super(opts);
        },

        getSide: function(){
          return  this.wrapper.find('.sides');
        },
        setContent: function(){
          this.getSide().html(this.content);
        },
        show: function(){
            var fxprops = {};
            fxprops[this.data.position] = 0;
            this.showed = true;
            this.getSide().fx(fxprops, 300, 'easeInBack');
        },
        hide: function(){
            var side = this.getSide();
            var fxprops = {};
                fxprops[this.data.position] = -side.width();
            this.showed = false;
            side.fx(fxprops, 300, 'easeInBack');
        }
    });

    return Sides;
});
