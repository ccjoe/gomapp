define(['View','Fx'], function(View) {
    var defaultBtn = {
        position: 'left',   //left or right
        content: ''         // string or html
    };
    /**
     * @class Gom.UI.Sides
     * @alias Sides
     * @extends {Gom.View}
     * @param {object} opts
     * @param {object} [opts.position=left] 侧边栏位置 左侧或右侧
     * @param {object} opts.content='' 侧边栏内容
     * @example
      var side = new UI.Sides({data:{position: pos}}).render();
          side.content = sidesDesc + ListSet;
          side.setContent();
     */
    var Sides = View.extend({
        init: function (opts) {
            opts.data = _.extend({}, defaultBtn, opts.data);
            opts.tmplname = 'ui.sides';
            opts.wrapper = opts.wrapper || '#sides';
            $.extend(opts, this);   //将List实例混合到opts上， 去父对象上执行
            this._super(opts);
        },
        events:{
            'click .sides-overlay': 'hide'
        },
        /**
         * 获取侧边栏内容
         * @method Gom.UI.Sides#getSides
         * @returns {*}
         */
        getSides: function(){
            return  this.wrapper.find('.sides');
        },
        getOverlay: function(){
            return  this.wrapper.find('.sides-overlay');
        },
        /**
         * 设置侧边栏内容
         * @method Gom.UI.Sides#setContent
         * @param {html|string} [str=this.content]
         */
        setContent: function(str){
          this.getSides().html(str ? str : this.content);
        },
        /**
         * 显示侧边栏
         * @method Gom.UI.Sides#show
         */
        show: function(){
            this.getOverlay().css('visibility', 'visible');

            var fxprops = {};
            fxprops[this.data.position] = 0;
            this.showed = true;
            this.getSides().fx(fxprops, 500, 'easeOutCirc');
        },
        /**
         * 隐藏侧边栏
         * @method Gom.UI.Sides#hide
         */
        hide: function(){
            var that = this;
            var side = this.getSides();
            var fxprops = {};
                fxprops[this.data.position] = -side.width();
            this.showed = false;
            side.fx(fxprops, 500, 'easeOutCirc', function(){
                that.getOverlay().css('visibility', 'hidden');
            });
        }
    });

    return Sides;
});
