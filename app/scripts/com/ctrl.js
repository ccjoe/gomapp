/**
 *  Model AJAX 核心
 */
define(['com/config'], function(Config) {
    'use strict';
    var com = {
        msg: function(str){
            var $f = $('#flash');
            $f.text(str).show()
              .css({'margin-left': -$f.width()/2, 'margin-top':-$f.height()/2});
            var t = setTimeout(function(){
                clearTimeout(t);
                $f.hide(100);
            }, 2000);
        }
    };
    return com; 
});


