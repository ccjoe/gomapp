/*
 * swipe
 */
/*
* * 主要提供以下回调函数：
 beforeCallback (实例化之前触发的回调函数),
 sCallback (start callback,touchstart时触发的回调函数),
 mCallback (move callback,touchmove时触发的回调函数),
 eCallback (end callback,touchend时触发的回调函数)
 afterCallback (实例化之后触发的回调函数),

 * 回调函数中会传入touch事件相关回调参数：
 self:实例化的BOX,
 startX:触点起始X,
 startY:触点起始Y,
 boxLeft:(Box Left) 相对于文档的left偏移,
 boxTop:(Box Top)相对于文档的top偏移,
 boxWidth:(Box Width)BOX的宽度,
 boxHeight:(Box Height)BOX的高度,
 boxRightRange:(Box Right Border)BOX的右边界,
 boxBottomRange:(Box Bottom Border)BOX的下边界,
 endX:触点结束X;
 endY:触点结束Y;
 moveX:(move x distance)X方向滑动距离;
 moveY:(move y distance)Y方向滑动距离;
 direction:手势滑动方向(left/right/false);
 angle:单点手势滑动角度;
 duration:手势持续时间;
 vendor:浏览器前缀(-moz/-webkit/-o/-ms);


 touchPoint.multiTouch:是否多点触摸(touchmove时可监控);
 touchPoint.gStartDis:(gisture start distance)手势起始距离;
 touchPoint.gEndDis:(gisture end distance)手势结束距离;
 touchPoint.scale:手势缩放比例;
 touchPoint.rotation:手势旋转角度;

 * 同时在外部回调函数中提供修改内部touchPoint数据的接口:
 touchPoint.setAttr(name,value);
 * 调用方法:
 */
function Swipe(touchBox, opts) {
    var touchPoint = {
        self: touchBox,
        count: 0,
        speed: 300,
        minX: 30,       //X方向滑动的最小距离
        maxY: 30,       //Y方向滑动的最大距离
        initAngle: 30,  //最小满足角度
        touch: false,
        multiTouch: false,  //多点触控检测
        setAttr: function (name, value) {
            touchPoint[name] = value;
        }
    };

    // init初始化
    (function () {
        that = touchPoint.self;
        for (var o in opts) {
            touchPoint[o] = opts[o];
        }
        var offset = that.offset();
        touchPoint.boxLeft = offset.left;
        touchPoint.boxTop = offset.top;
        touchPoint.boxWidth = that.width();
        touchPoint.boxHeight = that.height();
        touchPoint.boxRightRange = touchPoint.boxLeft + touchPoint.boxWidth; //右边界
        touchPoint.boxBottomRange = touchPoint.boxTop + touchPoint.boxHeight; //下边界
        touchPoint.total = that.children().children().length;
    })();

    // 浏览器特性检测
    touchPoint.vendor = (/webkit/i).test(navigator.appVersion) ? 'webkit' :
        (/firefox/i).test(navigator.userAgent) ? 'Moz' :
            'opera' in window ? 'O' : '';
    touchPoint.has3d = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix();
    touchPoint.hasTouch = 'ontouchstart' in window;
    touchPoint.hasTransform = touchPoint.vendor + 'Transform' in document.documentElement.style;

    // 方向检测(左移距离，上移距离)
    function directionDetect(l, t) {
        if (Math.abs(t) < touchPoint.maxY && Math.abs(l) > touchPoint.minX) {
            var rStr = l < 0 ? 'left' : 'right';
            return rStr;
        }
        return false;
    }

    // 边界检测
    function borderDetect(x, y) {
        return (x < touchPoint.boxLeft || x > touchPoint.boxRightRange || y < touchPoint.boxTop || y > touchPoint.boxBottomRange);
    }

    // 获取夹角(通过arctant反三角函数)
    function getAngle(n) {
        return Math.atan(n) * 180 / Math.PI;
    }

    // 获取距离(通过两边计算第三边)
    function getDis(xLen, yLen) {
        return Math.sqrt(Math.pow(xLen, 2) + Math.pow(yLen, 2));
    }

    // 设置touchPoint的改变数据（默认设置改变数据，如果setList存在，则遍历setList设置属性）
    function setouchPointData(point, setList) {
        if (setList) {
            for (var o in setList) {
                touchPoint.setAttr(o, setList[o]);
            }
        } else {
            var t = new Date();
            touchPoint.endX = point.pageX;
            touchPoint.endY = point.pageY;
            touchPoint.endTime = t.getTime();
            touchPoint.duration = touchPoint.endTime - touchPoint.startTime;
            touchPoint.moveX = point.pageX - touchPoint.startX;//滑动距离
            touchPoint.moveY = point.pageY - touchPoint.startY;
            touchPoint.direction = directionDetect(touchPoint.moveX, touchPoint.moveY);
            touchPoint.angle = getAngle(touchPoint.moveY / touchPoint.moveX);
        }
    }

    // 多点触摸检测(只检测两点触摸)
    function multiTouchDetect(e) {
        touchPoint.tLen = e.touches.length;
        if (touchPoint.tLen > 1) {
            var point0 = e.touches[0],
                point1 = e.touches[1],
                xLen = point1.pageX - point0.pageX,
                yLen = point1.pageY - point0.pageY,
                angle = getAngle(yLen / xLen),
                gDis = getDis(xLen, yLen);
            if (!touchPoint.multiTouch) {
                touchPoint.gStartDis = gDis;
                touchPoint.gStartAngle = angle;
            } else {
                touchPoint.gEndDis = gDis;
                touchPoint.gEndAngle = angle;
                touchPoint.scale = gDis / touchPoint.gStartDis;
                touchPoint.rotation = angle - touchPoint.gStartAngle;
            }
            touchPoint.multiTouch = true;
        } else {
            touchPoint.multiTouch = false;
        }
        ;
    }

    function startCallback(e) {
        var point = e.touches[0],
            t = new Date();
        var setList = {
            startX: point.pageX,
            startY: point.pageY,
            startTime: t.getTime(),
            identifier: point.identifier
        }
        setouchPointData(point, setList);
        touchPoint.touch = true;
        if (typeof touchPoint.sCallback == "function") {
            touchPoint.sCallback(touchPoint);
        }
    }

    function moveCallback(e) {
        var point = e.touches[0];
        if (borderDetect(point.pageX, point.pageY)) {
            touchPoint.touch = false;
            return false;
        }
        if (touchPoint.touch) {
            setouchPointData(point);
            multiTouchDetect(e);// Muti touch detect
            if (typeof touchPoint.mCallback == "function") {
                touchPoint.mCallback(touchPoint);
            }
        }
        if (Math.abs(touchPoint.angle) < touchPoint.initAngle) {
            e.preventDefault();
        }
    }

    function endCallback(e) {
        touchPoint.touch = false;
        touchPoint.multiTouch = false;
        if (typeof touchPoint.eCallback == "function") {
            touchPoint.eCallback(touchPoint);
        }
    }

    // 实例化之前的回调函数
    if (typeof touchPoint.beforeCallback == "function") {
        touchPoint.beforeCallback(touchPoint);
    }

    // Touch事件监听
    that.die("touchstart,touchmove,touchend");
    that.get(0).addEventListener('touchstart', startCallback);
    that.get(0).addEventListener('touchmove', moveCallback);
    that.get(0).addEventListener('touchend', endCallback);

    // 实例化之后的回调函数
    if (typeof touchPoint.afterCallback == "function") {
        touchPoint.afterCallback(touchPoint);
    }
}

if (window.jQuery || window.Zepto) {
    (function (a) {
        a.fn.Swipe = function (b) {
            return this.each(function () {
                a(this).data("Swipe", new Swipe(a(this), b))
            })
        }
    })(window.jQuery || window.Zepto)
};
