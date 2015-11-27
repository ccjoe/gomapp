define(['base/core/view'], function(View) {
    var defaults = {
        type: 'horizontal',   //vertical/horizontal
        list: [{
            content: 'content1'
        },{
            content: 'content2'
        },{
            content: 'content3'
        }]
    };


    var Slide = View.extend({
        init: function (opts) {
            opts.data = _.extend({}, defaults, opts.data);
            opts.tmplname = 'ui.slide';
            $.extend(opts, this);   //将List实例混合到opts上， 去父对象上执行
            this._super(opts);
        },
        show: function(){
            this.wrapper.find('.slide-slide').each(function(i, item){
                $(item).swipe({

                });
            });

        },
        //events: {
        //    'swipeLeft .slide-slide': 'prev',
        //    'swipeRight .slide-slide': 'next'
        //},
        prev: function(e, item){
            console.log(e, item, 'prev');
        },
        next: function(e){
            console.log(e.pageX, e.pageY, 'next');
        }
    });

    return Slide;
});
