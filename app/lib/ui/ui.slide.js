function swipe($elem, opts){
    //触发事件的条件 opts defaults lastOpts
    var defaults = {
        'position': 'left',   //left right top bottom
        'x-distance': 30,     //x horizontal distance
        'y-distance': 30,     //y vertical distance
        'degree': 30          //0为不限制，否则动作必须小于这个角度才能触发相应事件
    };

    var lastOpts = $.extend({}, defaults, opts);

    //设置或获取point信息并申明初始值
    var point = {
        xd: 0,
        yd: 0,
        dg: 0,
        set: function(name, val){
            if(typeof name === 'string'){
                this[name] = val;
            }else{
                $.extend(this, name);
                return this;
            }
        }
    };

    var doPoint = {
        //边界检查
        checkRange: function(){

        },
        // 方向检测(左移距离，上移距离)
        directionDetect: function(l, t) {
            if (Math.abs(t) < touchPoint.maxY && Math.abs(l) > touchPoint.minX) {
                return l < 0 ? 'left' : 'right';
            }
            return false;
        },
        //计算角度
        getAngle: function(){

        }
    };

    var cbs = {
        startCallback : function(e){
            var cp = e.touch[0],
                startPoint = {
                    startX: cp.pageX,
                    startY: cp.pageY,
                    startTime: +new Date(),
                    identifier: e.identifier
                };
            point.set(startPoint);
            lastOpts.startCallback ? lastOpts.startCallback() : null;
        },
        moveCallback : function(e){
            var cp = e.touch[0],
                movePoint = {
                    moveX: cp.pageX,
                    moveY: cp.pageY,
                    moveTime: +new Date(),
                    identifier: e.identifier
                };
            point.set(movePoint);
            lastOpts.moveCallback ? lastOpts.moveCallback() : null;
        },
        endCallback : function(e){
            var cp = e.touch[0],
                endPoint = {
                    endX: cp.pageX,
                    endY: cp.pageY,
                    endTime: +new Date(),
                    identifier: e.identifier
                };
            point.set(endPoint);
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
