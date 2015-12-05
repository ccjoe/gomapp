define(function() {
    //水平或垂直滚动的面板，just it;
    var vendor = (/webkit/i).test(navigator.appVersion) ? 'webkit' :
        (/firefox/i).test(navigator.userAgent) ? 'Moz' :
            'opera' in window ? 'O' : '';
    var has3d = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix();
    /**
     * @construct Scroll
     * @param {object} opts
     * opts.wrapper     滚动对象所在的容器
     * opts.className   className 滚动对象的className
     * opts.step        步长
     * opts.outer       允许出界的范围
     * opts.outerFront  允许出界位置上面显示的html或文字
     //* opts.outerEnd    允许出界位置下面显示的html或文字
     * opts.direction   水平与垂直
     * opts.onScroll    每次滚动时回调
     * opts.endScroll   每次滚动停回调
     * opts.onTop       滚动到上时
     * opts.onBottom    滚动到下时
     */
    var Scroll = Class.extend({
        init: function (opts) {
            var defalutsThis = {
                $wrapper : $(opts.wrapper),
                $scroll : $(opts.className),
                step    : opts.step || 50,
                outer   : opts.outer ||150,
                outerFront: opts.outerFront || '更在更新中...',
                outerEnd:  opts.outerEnd || '已加载完毕...',
                isx     : opts.direction !== 'vertical',
                onScroll  : opts.onScroll || function(){},
                endScroll : opts.endScroll || function(){},
                onTop : opts.onTop || function(){},
                onBottom : opts.onBottom || function(){}
            };

            $.extend(this, defalutsThis);
            this.construct();
        },
        construct: function(){
          this.bindScroll();
        },
        bindScroll: function(){
            var that = this;
            this.$wrapper.prepend('<div class="ui-scroll-front">'+this.outerFront+'</div>');
            this.$wrapper.append('<div class="ui-scroll-end">'+this.outerEnd+'</div>');
            this.$wrapper.addClass('ui-scroll').swipe({
                //swipeY: 30,
                moveCallback: function(point){
                    that._setScrollTrans(point, true);
                },
                endCallback: function(point){
                    that._setScrollTrans(point);
                }
            })
        },
        //滑动区域总高度
        getScrollHeight: function(){
            return this.$scroll.height();
        },
        getWrapperHeight: function() {
            return this.$wrapper.height();
        },
        //滚动到 num, elem, top, bottom
        /**
         * 滚动到...
         * @method scroll#scrollTo
         * @param {object} where 可以为具体的数字，元素, top, bottom字符串
         */
        scrollTo: function(where){
            var toType = typeof  where, val;
            if(where === 'top'){
                val = 0;
            }else if(where === 'bottom'){
                val = this.getWrapperHeight() - this.getScrollHeight();
            }
            if(toType === 'number'){
                val = where;
            }
            console.log(val, 'scrollTo val');
            this._scrollFxTo(val);
        },
        _scrollFxTo: function(val){
            this.$scroll.data('swipe-offset', val);
            this.$scroll.fx(this.scrollCount(val));
        },
        _setScrollTrans: function(point, moveing){
            var distance = this.isX ? point.swipeX : point.swipeY;
            var transVal = this._getStransVal(distance, point.swipeTime, moveing);
            var transStr = this.scrollCount(transVal);
            if(moveing){
                this.$scroll.css(transStr); //, 200, 'easeOutQuint'
                this.onScroll(point);
            }else{
                this._scrollFxTo(transVal); //, 200, 'easeOutQuint'
                this.endScroll(point);
            }
        },
        //计算当前滚动到的并限制边界范围
        _getStransVal: function(distance, swipeTime, moveing){
            distance = moveing ? distance : distance * this._getRatio(swipeTime);
            var swipeOffset = this.$scroll.data('swipe-offset') || 0;
            if(swipeOffset){
                distance += swipeOffset;
            }
            //限制区域
            var maxTransDis = this.getScrollHeight() - this.getWrapperHeight();
            var maxOuter    = moveing ? this.outer : 0,
                minRange = 0 + maxOuter,
                maxRange = maxTransDis + maxOuter;
            console.log(distance, minRange, maxTransDis, maxRange);
            var absDis = Math.abs(distance), pxDis = distance + 'px';
            //在顶端越界拉时
            if(0 < distance &&  distance <= minRange){
                $('.ui-scroll-front').show().css({height: pxDis,'line-height': pxDis});
            }
            //在底端越界拉时
            if(maxTransDis < absDis &&  absDis <= maxRange){
                pxDis = (absDis-maxTransDis)+'px';
                $('.ui-scroll-end').show().css({height: pxDis, 'line-height': pxDis});
            }

            if(distance > minRange){
                distance = minRange;
                if(!moveing){
                    this.onTop();
                    $('.ui-scroll-front').hide();
                };
            }

            if(distance < -maxRange){
                distance = -maxRange;
                if(!moveing){
                    this.onBottom();
                    $('.ui-scroll-end').hide();
                };
            }

            return distance;
        },

        _getRatio: function(swipeTime){
            var ratio;
            if(swipeTime > 1000){
                ratio = 1;
            }else{
                ratio = 1000/swipeTime;
                ratio = ratio > 30 ? 30 : ratio;
            }
            console.log(swipeTime, ratio, 'swipeRatio');
            return ratio;
        },

        //根据值计算滚动translate对象
        scrollCount: function(val){
            var isX =  this.isX;       //水平垂直
            var x = isX ? (val+'px') : '0',
                y = isX ? '0' : (val+'px');
            var props = {};
            props['-'+ vendor + '-transform'] = has3d ?
            "translate3d("+x+","+y+",0)" :
            "translate("+x+","+y+")";
            return props;
        }

    });
    return Scroll;
});
