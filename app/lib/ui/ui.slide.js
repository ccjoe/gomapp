define(['base/core/view'], function(View) {
    var defaults = {
        direction: 'horizontal',   //vertical/horizontal
        swipeX: 60,
        isloop: true,         //是否从最后一张到第一张
        list: []              //列表内容
    };

    var Slide = View.extend({
        init: function (opts) {
            opts.data = _.extend({}, defaults, opts.data);
            opts.tmplname = 'ui.slide';
            $.extend(opts, this);   //将List实例混合到opts上， 去父对象上执行
            this._super(opts);
        },
        show: function(){
            this.swipeItem();
        },
        getListDom: function(){
          return this.wrapper.find('.slide-wrapper');
        },
        getIndexDom: function(){
          return this.wrapper.find('.slide-pagination');
        },
        swipeItem: function(){
            var $slides = this.getListDom(),            //滑动容器
                $slide = $slides.find('.slide-slide'),  //滑动子项
                $index = this.getIndexDom(),            //指示
                len = $slide.length, $i, that = this,//元素个数, 元素,  this
                isloop = this.data.isloop,              //是否循环滚动
                isX =  this.data.direction ==='horizontal',       //水平垂直
                isize = isX ? $slides.width() : $slides.height(); //计算尺寸,
                swipeXY = isX ? 'swipeX' : 'swipeY',
                swipeDR = isX ? ['left', 'right'] : ['top', 'bottom'];

            $slide.each(function(i, item){
                  $i = $(item);
                  $i.swipe({
                      moveCallback: function(point){
                          var distance = point[swipeXY] + $i.width()*-i;
                          $slides.css(that.swipeCount(point, distance));

                      },
                      endCallback: function(point){
                          var index, rollback = function(num){
                              num = num !== void 0 ? num : i; //无参默认回滚
                              $slides.fx(that.swipeCount(point, isize*-num));
                          };

                          if(Math.abs(point[swipeXY]) < that.data[swipeXY]){
                              rollback();
                              return;
                          }

                          if(point.direction === swipeDR[0]){
                              index = i+1;
                              if(index === len){
                                  if(!isloop){
                                      rollback();
                                      return;
                                  }
                                  index =  0;
                              }
                          }else if(point.direction === swipeDR[1]){
                              index = i-1;
                              if(index < 0){
                                  if(!isloop){
                                      rollback();
                                      return;
                                  }
                                  index = len-1;
                              }

                          }else{    //水平滚动时非swipe非水平时回滚
                              rollback();
                          }
                          rollback(index);
                          $index.find('.slide-pagination-bullet').eq(index).addClass('slide-pagination-bullet-active')
                                                                .siblings().removeClass('slide-pagination-bullet-active');
                      }
                  });
              });
        },
        //get {-webkit-transform: translate3d(x,y,0)}
        swipeCount: function(point, distance){
            var isX = this.data.direction ==='horizontal';
            var x = isX ? (distance+'px') : '0',
                y = isX ? '0' : (distance+'px');
            var props = {};
                props['-'+ point.vendor + '-transform'] = point.has3d ?
                    "translate3d("+x+","+y+",0)" :
                    "translate("+x+","+y+")";
                return props;
        }
    });

    return Slide;
});
