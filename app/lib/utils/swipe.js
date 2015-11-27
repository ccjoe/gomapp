/**
 * instead of zepto touch.js
 * @author Joe Liu
 * @email icareu.joe@gmail.com
 */
(function(){
    function swipe($elem, opts) {
        //触发事件的条件 opts defaults lastOpts
        var defaults = {
            'swipeX': 30,     //x horizontal distance
            'swipeY': 30,     //y vertical distance
            'direction': null
            //'degree': 30          //0为不限制，否则动作必须小于这个角度才能触发相应事件
        };
        var lastOpts = $.extend({}, defaults, opts);

        var doPoint = {
            //默认值以及置空
            setNull: {
                startX: null,
                startY: null,
                startTime: null,
                moveX: null,
                moveY: null,
                moveTime: null,
                swipeX: null,
                swipeY: null,
                swipeTime: null,
                direction: null
            },
            //边界检查
            checkRange: function (point) {
                return point.swipeX >= lastOpts.swipeX &&
                    point.swipeY >= lastOpts.swipeY &&
                    (lastOpts.direction ? point.direction === lastOpts.direction : true);
            },
            //方向检测
            getDirection: function (point) {
                if (Math.abs(point.degree) > 45) {    //水平方向
                    return point.swipeX < 0 ? 'left' : 'right';
                } else {                              //垂直方向
                    return point.swipeY < 0 ? 'top' : 'bottom';
                }
            },
            //计算角度 垂直方向近0,水平方向近90
            getAngle: function (xd, yd) {
                return Math.atan(yd / xd) * 180 / Math.PI;
            }
        };
        //设置或获取point信息
        var point = {
            set: function (name, val) {      //设置相应属性
                if (typeof name === 'string') {
                    this[name] = val;
                } else {
                    $.extend(this, name);
                    this.auto();           //move与end更新时更新相应opts信息
                    console.log(this, 'poine');
                    return this;
                }
            },
            auto: function () {             //在set point时自动计算opts相应值
                this.swipeX = this.moveX - this.startX;     //滑动距离X
                this.swipeY = this.moveY - this.startY;     //滑动距离Y
                this.swipeTime = this.moveTime - this.startTime;  //滑动时长Yms
                this.degree = doPoint.getAngle(this.swipeY, this.swipeX);  //滑动角度Yms
                this.direction = doPoint.getDirection(this);
            }
        };

        //callbacks
        var cbs = {
            startCallback: function (e) {
                $.extend(point, doPoint.setNull); //重置初始值
                var cp = e.touches[0],
                    startPoint = {
                        startX: cp.pageX,
                        startY: cp.pageY,
                        startTime: +new Date()
                        //identifier: e.identifier
                    };
                point.set(startPoint);

                lastOpts.startCallback ? lastOpts.startCallback(point) : null;
            },
            moveCallback: function (e) {
                var cp = e.touches[0],
                    movePoint = {
                        moveX: cp.pageX,
                        moveY: cp.pageY,
                        moveTime: +new Date()
                        //identifier: e.identifier
                    };
                point.set(movePoint);
                if (!doPoint.checkRange(point)) {
                    return;
                }
                lastOpts.moveCallback ? lastOpts.moveCallback(point) : null;
            },
            endCallback: function (e) {
                console.log(e, 'endE');
                lastOpts.endCallback ? lastOpts.endCallback() : null;
            }
        };

        // Touch事件监听
        $elem.die("touchstart,touchmove,touchend");
        $elem.get(0).addEventListener('touchstart', cbs.startCallback);
        $elem.get(0).addEventListener('touchmove', cbs.moveCallback);
        $elem.get(0).addEventListener('touchend', cbs.endCallback);
    }

    ['swipe', 'swipeLeft', 'swipeRight', 'swipeTop', 'swipeBottom'].forEach(function (item) {
        var direct = /swipe(\w*)/.exec(item)[1];
        $.fn[item] = function (opts) {
            this.each(function() {
                swipe($(this), $.extend(opts, {direction: direct}));
            });
            return true;
        };
    });

})();





