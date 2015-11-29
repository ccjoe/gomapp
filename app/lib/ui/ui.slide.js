define(['base/core/view'], function(View) {
    var defaults = {
        type: 'slide-horizontal',   //slide-vertical/slide-horizontal/tab-top/tab-bottom
        swipeX: 60,
        isloop: true,         //是否从最后一张到第一张
        initIndex: 0,         //初始显示index
        list: []              //列表内容
    };

    var vendor = (/webkit/i).test(navigator.appVersion) ? 'webkit' :
        (/firefox/i).test(navigator.userAgent) ? 'Moz' :
            'opera' in window ? 'O' : '';
    var has3d = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix();

    var Slide = View.extend({
        init: function (opts) {
            opts.data = _.extend({}, defaults, opts.data);
            opts.tmplname = 'ui.switch';
            $.extend(opts, this);   //将List实例混合到opts上， 去父对象上执行
            this._super(opts);
        },
        show: function(){
            this.swipeContainer(this.data.initIndex);
        },
        getRootDom: function(){
            return this.wrapper.find('.switch-container');
        },
        getListDom: function(){
          return this.wrapper.find('.switch-wrapper');
        },
        getIndexDom: function(){
          return this.wrapper.find('.switch-pagination');
        },
        events:{
          'click .switch-pagination-bullet': function(e, target, that){
              that.rollback($(target).attr('index'));
          }
        },
        //滚动到或回滚到index
        rollback: function(index){
            var $switchs = this.getListDom(),
                $index = this.getIndexDom(),
                isX =  /(^\w+)-?(\w+)?/.exec(this.data.type)[2] !== 'vertical',       //水平垂直
                isize = isX ? $switchs.width() : $switchs.height(); //计算尺寸

            $switchs.fx(this.swipeCount(isize*-index));
            $index.find('.switch-pagination-bullet').eq(index).addClass('active').siblings().removeClass('active');
        },
        //index为初始显示
        swipeContainer: function(index){
            var that = this,
                $root = this.getRootDom(),
                $switchs = this.getListDom(),            //滑动容器
                $switch = $switchs.find('.switch-item'),  //滑动子项
                $index = this.getIndexDom(),            //指示
                len = $switch.length, that = this,//元素个数, 元素,  this
                isloop = this.data.isloop,              //是否循环滚动
                isX =  /(^\w+)-?(\w+)?/.exec(this.data.type)[2] !== 'vertical',       //水平垂直
                isize = isX ? $switchs.width() : $switchs.height(), //计算尺寸,
                swipeXY = isX ? 'swipeX' : 'swipeY',
                swipeDR = isX ? ['left', 'right'] : ['top', 'bottom'];

            this.rollback(index);

            $switchs.swipe({
                moveCallback: function(point){
                  var distance = point[swipeXY] + $root.width()*-index;
                  $switchs.css(that.swipeCount(distance));

                },
                endCallback: function(point){
                  if(Math.abs(point[swipeXY]) < that.data[swipeXY]){
                      that.rollback(index);
                      return;
                  }

                  if(point.direction === swipeDR[0]){
                      index++;
                      if(index === len){
                          if(!isloop){
                              that.rollback(index);
                              return;
                          }
                          index =  0;
                      }
                  }else if(point.direction === swipeDR[1]){
                      index--;
                      if(index < 0){
                          if(!isloop){
                              that.rollback(index);
                              return;
                          }
                          index = len-1;
                      }

                  }
                  that.rollback(index);
                  console.log(index, len);
                }
            });
        },
        //get {-webkit-transform: translate3d(x,y,0)}
        swipeCount: function(distance){
            var isX =  /(^\w+)-?(\w+)?/.exec(this.data.type)[2] !== 'vertical';       //水平垂直
            var x = isX ? (distance+'px') : '0',
                y = isX ? '0' : (distance+'px');
            var props = {};
                props['-'+ vendor + '-transform'] = has3d ?
                    "translate3d("+x+","+y+",0)" :
                    "translate("+x+","+y+")";
                return props;
        }
    });

    return Slide;
});
