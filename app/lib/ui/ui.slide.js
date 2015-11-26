function swipe($elem, opts){
    //触发事件的条件 opts defaults lastOpts
    var defaults = {
        'swipeX': 30,     //x horizontal distance
        'swipeY': 30,     //y vertical distance
        //'degree': 30          //0为不限制，否则动作必须小于这个角度才能触发相应事件
    };
    var lastOpts = $.extend({}, defaults, opts);

    var doPoint = {
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
            identifier: null
        },
        //边界检查
        checkRange: function(point){
            return point.swipeX >= lastOpts.swipeX && point.swipeY >= lastOpts.swipeY;
        },
        //方向检测(左移距离，上移距离)
        directionDetect: function(l, t) {
            if (Math.abs(t) < touchPoint.maxY && Math.abs(l) > touchPoint.minX) {
                return l < 0 ? 'left' : 'right';
            }
            return false;
        },
        //计算角度 垂直方向近0,水平方向近90
        getAngle: function(xd, yd){
            return Math.atan(yd/xd) * 180 / Math.PI;
        }
    };
    //设置或获取point信息
    var point = {
        set: function(name, val){      //设置相应属性
            if(typeof name === 'string'){
                this[name] = val;
            }else{
                $.extend(this, name);
                this.auto();           //move与end更新时更新相应opts信息
                console.log(this, 'poine');
                return this;
            }
        },
        auto: function(){             //计算opts相应值
            this.swipeX = this.moveX - this.startX;     //滑动距离X
            this.swipeY = this.moveY - this.startY;     //滑动距离Y
            this.swipeTime = this.moveTime - this.startTime;  //滑动时长Yms
            this.degree = doPoint.getAngle(this.swipeY, this.swipeX);  //滑动角度Yms
        }
    };

    //callbacks
    var cbs = {
        startCallback : function(e){
            $.extend(point, doPoint.setNull); //重置初始值
            var cp = e.touches[0],
                startPoint = {
                    startX: cp.pageX,
                    startY: cp.pageY,
                    startTime: +new Date(),
                    identifier: e.identifier
                };
            point.set(startPoint);

            lastOpts.startCallback ? lastOpts.startCallback(point) : null;
        },
        moveCallback : function(e){
            var cp = e.touches[0],
                movePoint = {
                    moveX: cp.pageX,
                    moveY: cp.pageY,
                    moveTime: +new Date(),
                    identifier: e.identifier
                };
            point.set(movePoint);
            lastOpts.moveCallback ? lastOpts.moveCallback(point) : null;
        },
        endCallback : function(e){
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
                swipe($(item), {
                    moveCallback: function(point){
                        $(item).html('<p>x距离：'+point.swipeX+'</p><p>y距离：'+point.swipeY+'</p><p>角度：'+point.degree+'</p><p>用时：'+point.swipeTime+'</p>');
                    }
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
