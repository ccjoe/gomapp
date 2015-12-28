define(['View', 'Select', 'Url', 'Store'], function(View, Select,Url, Store) {
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

    /**
     * 表单组件基础类
     * 1.规定所有表单组件都有隐藏域可以方便GETTER/SETTER组件的值
     * 2.实现表单值与视图的双向绑定，view->value, value->view(需要调用fresh方法)
     */
    var FormBase = Class.extend({
        init: function(){
            $.extend(opts, this);
            this._super(opts);
        },
        /**
         * 隐藏域一般在表单组件内，但有些在prev()这里，以表单内优先
         * @method Gom.UI.FormBase#getInput
         */
        getInput: function(){
           var $el = this.wrapper;
           var innerInput = $el.find('input:hidden'),
               outerInput = $el.prev().filter('input:hidden');
            return innerInput.length ? innerInput : outerInput;
        },
        /**
         * 设置表单组件值后调用此方法刷新表单组件视图
         * @method Gom.UI.FormBase#fresh
         */
        fresh: function(){},
        show: function(){
            this.fresh();
        },
        /**
         * 有些表单是列表类的可以获取item集集合
         */
        getItems: function(){
            return this.wrapper.find('.item');
        }
    });
    /**
     * 在ios的UI里toggle里是没有文字的，在android里是有的，这里暂时按ios里UI
     * @class Gom.UI.Toggle
     * @alias Toggle
     * @extends {Gom.View}
     * @param {object} opts
     */
    var Toggle = View.extend({
        init: function (opts) {
            opts.tmpl = '<div class="toggle"><div class="toggle-handle"></div></div>';
            opts.replace = true;
            $.extend(opts, this);
            this._super(opts);
        },
        /**
         * 根据表单的值刷新视图
         * @method Gom.UI.Radio#fresh
         */
        fresh: function(){
            var $wp = this.wrapper,
                has = $wp.prev().filter('input:hidden').val();
            $wp[(has=='true' ?  'add' : 'remove') + 'Class']('active');
        },
        show: function(){
            var $wp = this.wrapper, has;
            $wp.on('click', '.toggle-handle', function(){
                has = $wp.hasClass('active');
                $wp[(has ? 'remove' : 'add') + 'Class']('active');
                $wp.prev().filter('input:hidden').val(!has).trigger('blur'); //触发blur是为了触发form的store机制
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

            this.fresh();
        }
    });

    /**
     * @class Gom.UI.Radio
     * @alias Forms.CheckBox
     * @param {object} opts 参列
     * @param {string} [opts.data.position=right] 左右
     **/
    var CheckBox = View.extend({
        init: function(opts){
            var data = opts.data;
            data.position = data.position || 'right';
            $.extend(opts, this);   //将父对象方法继承于此对象上
            this._super(opts);
            this.initCheck();
        },
        initCheck: function(){
            var $el = this.wrapper,  pos = this.data.position;
            $el.addClass('gom-checkbox gom-checkbox-'+pos);
        },
        show: function(){
            this.fresh();
        },
        /**
         * 根据值刷新视图
         * @method Gom.UI.Radio#fresh
         */
        fresh: function(){
            var that = this, val = this.getInput().val().split(','), $i;
            this.getItems().each(function(i,item){
                $i = $(item); $ival = String($i.data('keyval'));
               if( !!~val.indexOf($ival) ){
                   that.selectItem($i, false, true);
               }
            });
        },
        events: {
            'click .item': function(e, item, that){
                that.selectItem(item, true);
            }
        },
        getInput: function(){
            return this.wrapper.find('input:hidden');
        },
        /**
         * 获取CheckBox子项集
         * @method Gom.UI.Radio#getItem
         * @returns {*}
         */
        getItems: function(){
            return this.wrapper.find('.item');
        },
        /**
         * 选择某项
         * @method Gom.UI.CheckBox#selectItem
         * @param {element} current item元素
         * @param {boolean} storeIt 是否触发存储
         * @param {boolean} ingore 强制选中，不管之前的状态
         */
        selectItem: function(current, storeIt, ingore){
            $t = $(current); has = $t.hasClass('active');
            if(ingore) has = false;
            $t[has?'removeClass':'addClass']('active');
            if(storeIt){
                this.getInput().val(this.getVals()).trigger('blur');
            }
            return false;
        },
        /**
         * 获取Radio的选择结果的元素，没有直接获取值是因为在实际的开发中一般不是为了获取选中的文本，也许是ID，获取元素再根据元素获取想要的key的值
         * @method Gom.UI.CheckBox#getVals
         */
        getVals: function(){
            var vals = [];
            this.getItems().filter('.active').each(function(i, item){
                vals.push($(item).data('keyval'));
            });
            return vals;
        }
    });
    /**
     * @class Gom.UI.Radio
     * @alias Forms.Radio
     * @param {object} opts 参列
     * @param {string} [opts.data.position=right] 选择框位于左右
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
        /**
         * 根据值刷新视图
         * @method Gom.UI.Radio#fresh
         */
        fresh: function(){
            var that = this;
                val = this.getInput().val();
            this.getItems().each(function(i, item){
                if($(item).data('keyval') == val){
                    that.selectItem(item);
                }
            });
        },
        show: function(){
            this.fresh();
        },
        events: {
            'click .item': function(e, item, that){
                that.selectItem(item);
            }
        },
        getInput: function(){
            return this.wrapper.find('input:hidden');
        },
        /**
         * 获取Radio子项集
         * @method Gom.UI.Radio#getItem
         */
        getItems: function(){
            return this.wrapper.find('.item');
        },
        selectItem: function(current){
            var $t = $(current),
                $sb = $t.siblings(),
                $sbinput = this.getInput(),
                val = $t.data('keyval');
            $t.addClass('active');
            $sb.removeClass('active');
            $sbinput.val(val).trigger('blur');
            return false;
        }
    });

    /**
     * 在ios的UI里toggle里是没有文字的，在android里是有的，这里暂时按ios里UI
     * @class Gom.UI.InputLocation
     * @alias InputLocation
     * @extends {Gom.View}
     * @param {object} opts 参列
     * @param {object} opts.name 获取区域的表单的name值
     * @param {object} opts.onLocation 获取到地址时回调
     */
    var InputLocation = View.extend({
        init: function (opts) {
            var data = opts.data;
                data.name = data.name || 'location';
            opts.tmpl = '<div><input type="text" readonly class="input" name="'+ opts.data.name +'" placeholder="定位或选择" /><span class="icon-area"><i class="iconfont icon-location">定位</i></span></div>';
            //opts.replace = true;
            $.extend(opts, this);   //将List实例混合到opts上， 去父对象上执行
            this._super(opts);
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
         * 通过GD key及coord找到对应的位置字符串
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


    var defaultsForms = {
        store: true
    };
    /**
     * 在Form层对form进行一些处理【比如store为true的form会自动存储表单值，刷新会读取】
     * 需要注意的间，原生表单需要指定name, 自定义的组件类表单 需要在组件前加一个隐藏域
     * 如使用<input type="hidden" name="test">实现form值的序列化
     * 没有的话将不能本地存储,需要手动取值
     * @class Gom.UI.Form
     * @alias Form
     * @extends {Gom.View}
     * @param {object} opts 参列
     */
    var Form = View.extend({
        init: function(opts){
            this.tmpl = null;
            this.data = _.extend({}, defaultsForms, opts);
            this.wrapper = opts.wrapper ? $(opts.wrapper) : null;
            $.extend(opts, this);   //将父对象方法继承于此对象上
            this._super(opts);
            this.inputStore();
        },
        /**
         * 将根据hash和id存储localStorage
         * @method Gom.UI.Form#setStore
         */
        setStore: function(){
            var $el = this.wrapper, thisId = $el[0].id;
            var hash = Url.getHTML5Hash(location.search) || '/';
            if(!thisId){console.warn('需要存储localStorage须为Form指定ID, Debug模式将不会存储！'); return;}
            var expires = config.EXPIRES ? config.EXPIRES : 24*3600*1000;
            Store.set(hash+'_'+thisId, $el.serialize(), expires);
            console.log(this.getStore(true));
        },
        /**
         * 从localStorage取出数据
         * @method Gom.UI.Form#getStore
         * @param {boolean} isParse  为ture时返回的是对象,否则为string
         */
        getStore: function(isParse){
            var $el = this.wrapper, thisId = $el[0].id;
            var hash = Url.getHTML5Hash(location.search) || '/';
            var getSval = Store.get(hash+'_'+thisId);
            return isParse ?  Url.getParams(decodeURIComponent(getSval)) : getSval;
        },
        /**
         *将 serialize的值写入相应的form
         */
        inputStore: function(){
            var gets = this.getStore(true);
            if(!gets) return;
            for(var name in gets){
                this.wrapper.find('[name='+name+']').val(gets[name]);
            }
        },
        //监听所有表单的变化
        events:{
            'blur input,select': function(e, current, that){
                that.setStore();
            }
        }
    });

    return {
        CheckBox: CheckBox,
        Radio : Radio,
        Toggle: Toggle,
        Button: Button,
        InputLocation: InputLocation,
        Form: Form
    };
});
