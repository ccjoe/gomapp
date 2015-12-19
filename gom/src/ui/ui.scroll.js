//引入插件时没有参数，因为插件在框架里全局运行， 这就要求框架引入依赖的zepto需在框架之前
define(['Swipe', 'Fx'], function() {
    //水平或垂直滚动的面板，just it;
    var vendor = (/webkit/i).test(navigator.appVersion) ? 'webkit' :
        (/firefox/i).test(navigator.userAgent) ? 'Moz' :
            'opera' in window ? 'O' : '';
    var has3d = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix();
    /**
     * @class Gom.UI.Scroll
     * @alias Scroll
     * @param {object} opts 参列
     * opts.wrapper     require 滚动对象所在的容器
     * opts.className   require className 滚动对象的className
     * opts.step        options 步长 默认0 不计步长，滚动的结果一定是以此为单位, 滚屏网站时可以一屏一步长,
     *                  非滚动选择组件(time, district..)一般不用此属性,否则滚动以步长计不会具体到点
     * opts.outer       options 允许出界的范围,默认100
     * opts.outerFront       options 自定义front出界显示的html,false时没有，''时有默认，指定时显示指定
     * opts.outerEnd         options 同上
     *
     * opts.frontText  options 允许出界位置上面显示的html或文字
     * opts.endText  options 允许出界位置上面显示的html或文字
     * opts.speed 1     0与1之间  速度控制，默认1，在time选择器时设置小更容易选择，在页面滚动设置为1较好。
     * opts.outerEnd    允许出界位置下面显示的html或文字
     * opts.direction   options vertical/horizontal 默认为垂直 水平与垂直
     * opts.onScroll    options 每次滚动时回调 回调里的this指向本实例
     * opts.endScroll   options 每次滚动停回调 回调里的this指向本实例
     * opts.onTop       options 滚动到上时 回调里的this指向本实例
     * opts.onBottom    options 滚动到下时 回调里的this指向本实例
     //* opts.scrollBar options 是否显示滚动条
     * @example 实例
     * new Scroll({
             wrapper    : '.scroll-example2',    //滚动对象所在的容器
             className  : '.scroll-content',      //滚动对象的className
             direction  : 'vertical', //'vertical',             //水平与垂直
             step       : 0, // 不设置步长
             outer:       允许出界的范围
             frontText : '允许出界位置上面显示的html或文字',
             EndText   : '允许出界位置下面显示的html或文字',
             onScroll: function(point){ },    //每次滚动时回调
             endScroll: function(point){ console.log('单次滚动结束'); }, //   每次滚动停回调
             onTop: function(){ console.log('滚动到最上面，滚动停止时触发')},       //滚动到上时
             onBottom:  function(){ console.log('滚动到最下面，滚动停止时触发')}   // 滚动到下时
        });
     */

    var getFreshStr = function(moveStr, freshStr){
        return '<div class="pull-to-refresh-layer">' +
        '<div class="pull-show-item"><span class="preloader-text">'+moveStr+'</span><span class="preloader"></span></div>' +
        '<div class="pull-show-item"><span class="pull-to-refresh-text">'+freshStr+'</span><span class="pull-to-refresh-arrow"></span></div>' +
        '</div>';
    };

    var Scroll = Class.extend({
        init: function (opts) {
            opts.direction = opts.direction || 'vertical';

            var frontText = opts.frontText || '松手刷新', endText = opts.endText || '松手加载';

            var defalutsThis = {
                $wrapper : $(opts.wrapper),
                $scroll : $(opts.className),
                step    : opts.step || 0,
                speed   : opts.speed || 1,
                outer   : opts.outer===void 0 ? 100 : opts.outer,
                isX     : opts.direction !== 'vertical',
                onScroll  : opts.onScroll || function(){},
                endScroll : opts.endScroll || function(){},
                onTop : opts.onTop || function(){},
                onBottom : opts.onBottom || function(){}
            };

            if(!defalutsThis.isX && Number(defalutsThis.outer)>0){
                defalutsThis.outerFront = opts.outerFront===false?'':(opts.outerFront?opts.outerFront:getFreshStr('正在为您刷新', frontText));
                defalutsThis.outerEnd =  opts.outerEnd===false?'':(opts.outerEnd?opts.outerEnd:getFreshStr('正在拼命加载中...', endText));
            }
            $.extend(this, defalutsThis);
            this.construct();
        },
        construct: function(){
            this.$scroll.addClass('gom-scroll');
            this.bindScroll();
        },
        bindScroll: function(){
            var that = this, $wrapper = this.$wrapper, direct = this.isX?'horizontal':'vertical';
            console.log(direct, 'direct');
            if(this.outerFront){
                $wrapper.prepend('<div class="ui-scroll-front gom-scroll-out">'+this.outerFront+'</div>');
            }
            if(this.outerEnd){
             $wrapper.prepend('<div class="ui-scroll-end gom-scroll-out">'+this.outerEnd+'</div>');
            }

            var swipeOpts = {
                //swipeY: 30,
                moveCallback: function(point){
                    that._setScrollTrans(point, true);
                },
                endCallback: function(point){
                    that._setScrollTrans(point);
                }
            };
            this.isX ?
            $wrapper.addClass('ui-scroll ui-scroll-'+direct).swipeLeft(swipeOpts).swipeRight(swipeOpts):
            $wrapper.addClass('ui-scroll ui-scroll-'+direct).swipeTop(swipeOpts).swipeBottom(swipeOpts);
        },
        //滑动区域尺寸，纵向滚动获取总高度，横向滚动获取总宽
        getScrollSize: function(){
            return !this.isX ? this.$scroll.height() : this.$scroll.width();
        },
        //容器高度
        getWrapperSize: function() {
            return !this.isX ? this.$wrapper.height() : this.$wrapper.width();
        },
        //滚动到 num, elem, top, bottom
        /**
         * 滚动到...
         * @method Gom.UI.Scroll#scrollTo
         * @param {object} where 可以为具体的数字，元素, top, bottom字符串
         * @param {function} callback 滚动到后回调
         */
        scrollTo: function(where, callback){
            var toType = typeof  where, val;
            if(where === 'top'){
                val = 0;
            }else if(where === 'bottom'){
                val = -this.getMaxTrans();
            }
            if(toType === 'number'){
                val = where;
            }
            console.log(val, 'scrollTo val');
            this._scrollFxTo(val, callback);
            console.log(this.getSteps(), '滚动的步长为：');
        },

        /**
         * 设置了step时获取滚动了多少步长
         * @method Gom.UI.Scroll#getSteps
         * @return  {number} 步长数
         */
        getSteps: function(){
            return   this.$scroll.data('swipe-steps');
        },
        _scrollFxTo: function(val, callback){
            //有步长值的话以步长计
            if(this.step){
                var vals = this._getTransStep(val);
                console.log(vals, '步长信息');
                val = vals.val;
                this.$scroll.data('swipe-steps', vals.stepNum);
            }

            this.$scroll.data('swipe-offset', val);
            this.$scroll.fx(this._scrollCount(val), 'normal', 'linear', callback?callback:function(){});  //, 'normal', 'easeOutQuint'
        },
        //滚动时回调（moving为true为事件中回调，false为事件结束时回调）
        _setScrollTrans: function(point, moveing){
            var distance = this.isX ? point.swipeX : point.swipeY;
            var transVal = this._getTransVal(distance, point.swipeTime, moveing);
            var transStr = this._scrollCount(transVal);
            if(moveing){
                this.$scroll.css(transStr);
                this.onScroll(point);
            }else{
                //hold住时不回弹,用于上拉刷新时等待刷新结果
                if(!this.hold){
                    this._scrollFxTo(transVal); //!this.hold ? transVal : $('.pull-to-refresh-layer').height()
                }
                this.endScroll(point);
            }
        },
        /**
         * 滚动到顶请求数据时需要调用，一般用于onTop显示刷新请求数据，成功后调用hideFresh()隐藏刷新
         * @method Gom.UI.Scroll#showFresh
         * @param {string} [pos=front] 显示刷新，头部刷新front,尾部end
         * @return  {number} 步长数
         */
        showFresh: function(pos){
            pos = pos || 'front';
            $('.ui-scroll-'+pos).addClass('refreshing').removeClass('pull-up');
            this.hold = true;
        },
        /**
         * 滚动到底请求数据时需要调用
         * @method Gom.UI.Scroll#hideFresh
         * @param {string} [pos=front] 隐藏刷新，头部刷新front,尾部end
         * @return  {number} 步长数
         */
        hideFresh: function(pos){
            pos = pos || 'front';
            var that = this;
            var toPos = pos==='front'?0:-(this.getMaxTrans());
            that.scrollTo(toPos, function(){
                $('.ui-scroll-'+pos).removeClass('refreshing');
                that.hold = false;
            });
        },
        getMaxTrans: function(){
            return this.getScrollSize() - this.getWrapperSize();
        },
        //计算当前滚动到的并限制边界范围
        _getTransVal: function(distance, swipeTime, moveing){
            distance = moveing ? distance : distance * this._getRatio(swipeTime);
            var swipeOffset = this.$scroll.data('swipe-offset') || 0;
            if(swipeOffset){
                distance += swipeOffset;
            }
            //限制区域
            var maxTransDis = this.getMaxTrans();
            var maxOuter    = moveing ? this.outer : 0,
                minRange = 0 + maxOuter,
                maxRange = maxTransDis + maxOuter;
            console.log(this.getScrollSize(), this.getWrapperSize(), distance, minRange, maxTransDis, maxRange, '滑动内容大小, 容器大小, 滑动距离, 最小范围, 最大位移， 最大范围');
            var absDis = Math.abs(distance), pxDis = distance + 'px';
            //在顶端越界拉没超过允许的out时
            if(0 < distance &&  distance <= minRange){
                $('.ui-scroll-front').show().addClass('pull-up');
                    //.css({height: pxDis,'line-height': pxDis});
            }
            //在底端越界拉没超过允许的out时
            if(maxTransDis < absDis &&  absDis <= maxRange){
                pxDis = (absDis-maxTransDis)+'px';
                $('.ui-scroll-end').show();
                    //.css({height: pxDis, 'line-height': pxDis});
            }
            //顶端越界超过允许的out时
            if(distance > minRange){
                distance = minRange;
                if(!moveing){
                    this.onTop();
                };
            }
            //底端越界超过允许的out时
            if(distance < -maxRange){
                distance = -maxRange;
                if(!moveing){
                    this.onBottom();
                    //$('.ui-scroll-end').hide();
                };
            }

            return distance;
        },

        //计算当前滚动到的并限制步长结果的值,返回步长数与与滚动步长的值
        _getTransStep: function(val){
            console.log(val, 'val');
            var step = this.step, stepNum = Math.round(val/step);
            return {
                stepNum: Math.abs(stepNum),
                val: step*stepNum
            };
        },
        //暂停回弹
        _holdScroll: function(){
            this.hold = true;
        },
        //根据swipe时间计算滚动速度
        _getRatio: function(swipeTime){
            var ratio, speedval = this.speed*1000;
            if(swipeTime > speedval){
                ratio = 1 * this.speed;
            }else{
                ratio = speedval/swipeTime;
                ratio = ratio > 20 ? 20 : ratio;
            }

            console.log(swipeTime, ratio, 'swipeRatio');
            return ratio;
        },

        //根据值计算滚动translate对象
        _scrollCount: function(val){
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
