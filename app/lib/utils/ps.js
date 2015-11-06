/******************************** publisher-subscriber ***********************************/
/**
 * 简单的发布订阅模式(publisher-subscriber)
 * @author Joe Liu
 * @class Cora.PS
 * @namespace
 * @exampl
 * Cora.PS.add('pubNO1', function(data){
     *      console.log('创建发布者时订阅的订阅者，接受到的数据是:', data);
     * });
 * function subNo1(data, name){
     *      console.log('subNo1订阅到'+name+'对象，将接受到消息，为：', data);
     * }
 * function subNo2(data, name){
     *      console.log('subFn2订阅到'+name+'对象，将接受到消息，为：', data);
     * }
 * Cora.PS.add('pubNO2');  //新增发布者 pubNO2;
 * subNo1.sub('pubNO1');   //subNo1订阅到 pubNO1
 * subNo2.sub('pubNO1').sub('pubNO2');   //subNo2订阅到 pubNO1
 * Cora.PS.send('pubNO1', {data:123}) //pubNO1发布消息
 * Cora.PS.send('pubNO2', {data:'pubNo2 From!'}) //pubNO1发布消息
 * @done 解决为一个PS对象，管理所有发布订阅对象
 */
define(function() {
    /**
     * @see Cora.PS
     */
    var PubSub = function(){
        //管理发布者, 键为发布者name,值为订阅者数组,
        this.pubs = {
            /*puberName: [suber, suber2]*/
        };
    };
    var ps = new PubSub();
    PubSub.prototype.get = function(name){
        return this.pubs[name];
    };
    PubSub.prototype.set = function(name, subArr){
        return this.pubs[name] = subArr;
    };

    /**
     * 创建新增发布者，并且有订阅者时绑定传入的订阅者
     * 如果发布者已存在，则为设置发布者
     * @method Cora.PS#add
     * @param {string} name 发布者名称或标识
     * @param {function} arguments 订阅者
     * @return {object} Cora.PS 对象
     */
    PubSub.prototype.add = function(name /*, sub1, sub2...*/){
        var subs = this.get(name) || [];
        if(subs.length){
            console.log('已存在'+name+'发布者,将会重置订阅者', {type: 'warn'});
        }
        var addsubs = [].slice.call(arguments);
        addsubs.shift();
        this.set(name, addsubs);
        return this;
    };
    /**
     * name的发布者发布动作
     * @method Cora.PS#send
     * @param {string} name 发布者名称或标识
     * @param {object} data 发布的数据
     * @return {object} Cora.PS 对象即发布者
     */
    PubSub.prototype.send = function(name, data){
        // 有deliver时订阅者即执行
        this.pubs[name].forEach(function(sub){
            sub(data, name);
        });
        return this;
    };
    /**
     * @method Function#sub
     * @param {string} name 订阅到 name 的发布者
     * @return {function} 订阅者
     */
    Function.prototype.sub = function(name){
        var isExist = ps.get(name).indexOf(this) !== -1;
        if(!isExist){
            ps.pubs[name].push(this);
        }
        return this;
    };
    /**
     * @method Function#unsub
     * @param {string} name 取消订阅到某pub(PS)对象
     * @return {function} 取消订阅者
     */
    Function.prototype.unsub = function(name){
        var psArr = ps.pubs[name];
        psArr.splice(psArr.indexOf(this),1)
        return this;
    };

    return ps;
});
