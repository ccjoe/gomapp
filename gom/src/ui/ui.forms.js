define(['View', 'Select'], function(View, Select) {
    var defaultsBtns = {
        type: 'primary',    //primary, positive, negative, link
        outline: false, //true/false
        icon: void 0, //icon className
        badge: void 0, //number || false
        title: ''
    };
    /**
     * @class Gom.UI.Button
     * @alias Button
     * @extends {Gom.View}
     * @param {object} opts 参数列表
     * @param {object} [opts.wrapper] 组件根元素 固定值opts.replace = true 替换组件根元素wrapper
     * @param {object} [opts.data]  组件数据相关
     * @param {string} [opts.data.type='primary'] Button类型,可选有primary, positive, negative, link
     * @param {boolean} [opts.data.outline=false] 是否有外边
     * @param {string|Undefined} [opts.data.icon] icon className
     * @param {string|Undefined} [opts.data.badge] 显示小数字
     * @param {string} opts.data.title 标题
     * @example
     * <div data-ui-widget="Button" data-opts='{"type":"negative", "badge": 10, "icon": "icon-search", "isblock": true}'>Text</div>
     * 或
     * new Button({data: opts, wrapper: '.class'});
     */
    var Button = View.extend({
        init: function (opts) {
            opts.data = _.extend({}, defaultsBtns, opts.data);
            opts.tmplname = 'ui.button';
            opts.replace = true;
            $.extend(opts, this);   //将List实例混合到opts上， 去父对象上执行
            this._super(opts);
        }
    });

    var defaults = {
        content: ['Male', 'Female']         // 暂不支持定义
    };
    /**
     * 在ios的UI里toggle里是没有文字的，在android里是有的，这里暂时按ios里UI
     * @class Gom.UI.Toggle
     * @alias Toggle
     * @extends {Gom.View}
     * @param {object} opts
     */
    var Toggle = View.extend({
        init: function (opts) {
            opts.data = _.extend({}, defaults, opts);
            opts.tmpl = '<div class="toggle"><div class="toggle-handle"></div></div>';
            opts.wrapper = opts.wrapper;
            opts.replace = true;
            $.extend(opts, this);   //将List实例混合到opts上， 去父对象上执行
            this._super(opts);
        },
        show: function(){
            var $wp = this.wrapper;
            $wp.off().on('click', '.toggle-handle', function(){
                $wp[($wp.hasClass('active') ? 'remove' : 'add') + 'Class']('active');
            });
            $wp.find('.toggle-handle').swipeLeft({
                endCallback: function(){
                    $wp.removeClass('active');
                }
            }).swipeRight({
                endCallback: function(){
                    $wp.addClass('active');
                }
            });
        }
    });

    /**
     * @class Gom.UI.Radio
     * @alias Forms.CheckBox
     * @param {object} opts 参列
     * @param {string} [opts.position=right] 左右
     **/
    var CheckBox = View.extend({
        init: function(opts){
            var data = opts.data;
            data.position = data.position || 'right';
            $.extend(opts, this);   //将父对象方法继承于此对象上
            this._super(opts);
            this.initRadio();
        },
        initRadio: function(){
            var $el = this.wrapper,  pos = this.data.position;
            $el.addClass('gom-checkbox gom-checkbox-'+pos);
        },
        events: {
            'click .item': 'selectItem'
        },
        selectItem: function(e, current){
            $t = $(current);
            $t[$t.hasClass('active')?'removeClass':'addClass']('active');
            return false;
        },
        /**
         * 获取Radio的选择结果的元素，没有直接获取值是因为在实际的开发中一般不是为了获取选中的文本，也许是ID，获取元素再根据元素获取想要的key的值
         * @method Gom.UI.CheckBox#getSelect
         */
        getSelect: function(){
            return this.wrapper.find('.item.active');
        }
    });
    /**
     * @class Gom.UI.Radio
     * @alias Forms.Radio
     * @param {object} opts 参列
     * @param {string} [opts.position=right] 左右
     **/
    var Radio = View.extend({
        init: function(opts){
            var data = opts.data;
            data.position = data.position || 'right';
            $.extend(opts, this);   //将父对象方法继承于此对象上
            this._super(opts);
            this.initRadio();
        },
        initRadio: function(){
            var $el = this.wrapper,  pos = this.data.position;
            $el.addClass('gom-radio gom-radio-'+pos);
        },
        events: {
            'click .item': 'selectItem'
        },
        selectItem: function(e, current){
            $t = $(current);
            $t[$t.hasClass('active')?'removeClass':'addClass']('active');
            $t.siblings().removeClass('active');
            $t.siblings().filter('input[type="hidden"]').val($.trim(this.getSelect().text()));
            return false;
        },
        /**
         * 获取Radio的选择结果的元素，没有直接获取值是因为在实际的开发中一般不是为了获取选中的文本，也许是ID，获取元素再根据元素获取想要的key的值
         * @method Gom.UI.Radio#getSelect
         */
        getSelect: function(){
            return this.wrapper.find('.item.active');
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

    /* var defaultsForms = {
     store: true
     }
     /!*
     *
     *!/
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
     });*/

    return {
        CheckBox: CheckBox,
        Radio : Radio,
        Toggle: Toggle,
        Button: Button,
        InputLocation: InputLocation
    };
});
