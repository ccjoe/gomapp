define(['View', 'Select',  'Store'], function(View,  Select, Store) {
    var defaultsForms = {
        store: true
    }
    /*
     *
     */
    var Forms = Class.extend({
        init: function(opts){
            this.tmpl = '';  
            this.data = _.extend({}, defaultsForms, opts);
            this.wrapper = opts.wrapper ? $(opts.wrapper) : null;
            // this._id = 
        },
        setStore: function(){
            var $el = this.wrapper;
            Store.set(this.wrapper, $el.serialize());
        },
        getStore: function(){
            // Store.get()
        }
    });
    /**
     * 在ios的UI里toggle里是没有文字的，在android里是有的，这里暂时按ios里UI
     * @class Gom.UI.InputLocation
     * @alias InputLocation
     * @extends {Gom.View}
     * @param {object} opts 参列
     * @param {object} opts.onLocation 获取到地址时回调
     */
    var InputLocation = View.extend({
        init: function (opts) {
            opts.data = _.extend({},  opts);
            opts.tmpl = '<div><input type="text" readonly class="input" placeholder="定位或选择" /><span class="icon-area"><i class="iconfont icon-location">定位</i></span></div>';
            // opts.replace = true;
            $.extend(opts, this);   //将List实例混合到opts上， 去父对象上执行
            this._super(opts);
        },
        show: function(){
            console.log('show');
        },
        events:{
            'click .icon-area': 'getCoord',
            'click input': 'selectLocation'
        },
        getInput: function(){
            return this.wrapper.find('input');
        },
        selectLocation: function(){
            console.log('selectLocation');
            var num = [01,02,03];
            new Select({data: {
                title: '时间选择器',
                cascade: false,
                //modal:isModal,
                //wrapper: $('.content').last(),
                level: 3,
                list: {'1':['上午','下午'],'2': num.concat(_.range(10,13)), '3': num.concat(_.range(10,61))},
                onYes: function(val){
                   
                }
            }}).render();
        },
        /**
         *通过html5获取地理坐标
         */
        getCoord: function(){
            console.log('getCoord');
            var that = this; geo = navigator.geolocation;
            if (!geo){
                this.showToast('您的浏览器不支持地理位置');
                return;
            }
            geo.getCurrentPosition(function(position){
                that.location(position.coords, '0b895f63ca21c9e82eb158f46fe7f502', function(addr){
                    that.getInput().val(addr.province+ addr.city + addr.district);
                    that.onLocation ? that.onLocation(addr) : null;
                });
            });
        }, 
        /**
         *通过GD key及coord找到对应的位置字符串
         * @param {object} coord坐标
         * @param {number} coord.longitude 坐标
         * @param {object} coord.latitude  坐标
         * @param {string} key  GD地图key
         * @param {function} callback 回调
         */
        location: function(coord, key, callback){
            var gdAddr = 'http://restapi.amap.com/v3/geocode/regeo?key='+key+'&location='+coord.longitude+','+coord.latitude+'&output=json';
            $.ajax({
                url: gdAddr,
                dataType : 'jsonp',
                success: function(data){
                    if(data.info === 'OK'){
                        var addr = data.regeocode.addressComponent;
                        callback ? callback(addr) : null;
                        console.log(addr);
                    }
                }
            });
        }
    });

    return InputLocation;
});
