define(function(Slide) {
    'use strict';
    return {
        init: function(page){
            page.render(this.swipeDemo);
        },
        swipeDemo: function(){
            var $i = $('.content-swipe-demo');
            console.log($i, '$i');

            $i.swipeTop({
                moveCallback: function (point) {
                    $i.html('<p>方向：top  </p><p>x距离：' + point.swipeX + '</p><p>y距离：' + point.swipeY + '</p><p>角度：' + point.degree + '</p><p>用时：' + point.swipeTime + 'ms</p>');
                }
            });

            $i.swipeBottom({
                moveCallback: function (point) {
                    $i.html('<p>方向：bottom  </p><p>x距离：' + point.swipeX + '</p><p>y距离：' + point.swipeY + '</p><p>角度：' + point.degree + '</p><p>用时：' + point.swipeTime + 'ms</p>');
                }
            });

            $i.swipeLeft({
                moveCallback: function (point) {
                    $i.html('<p>方向：left  </p><p>x距离：' + point.swipeX + '</p><p>y距离：' + point.swipeY + '</p><p>角度：' + point.degree + '</p><p>用时：' + point.swipeTime + 'ms</p>');
                }
            });

            $i.swipeRight({
                moveCallback: function (point) {
                    $i.html('<p>方向：right  </p><p>x距离：' + point.swipeX + '</p><p>y距离：' + point.swipeY + '</p><p>角度：' + point.degree + '</p><p>用时：' + point.swipeTime + 'ms</p>');
                }
            });

        }
    };
});

