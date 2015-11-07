define(function () {
    var storage = window.localStorage;

    var parseval = function(val){
        if (typeof val !== 'string') { return undefined ;}
        try { return JSON.parse(val) ;}
        catch(e) { return val || undefined ;}
    };

    var strval = function(val){
        return val === void 0 || typeof val === "function" ? val+'' : JSON.stringify(val);
    };

    var bindtime = function(val, expire){
        if(expire===void 0)
            return strval({"value":val});
        return strval({
            "value": val,
            "expire": +new Date()+expire
        });
    };

    var store = {
        on: function(callback){
            window.addEventListener('storage', function(e) {
                callback(e);
            });
        },
        each: function(callback){
            var that = this;
            for(var i=0; i<storage.length; i++){
                key = storage.key[i];
                val =  that.noexpire(key);
                if(val){
                    callback(key, val);
                }
            }
        },
        /**
         * 判断key是否过期，没有返回key的值，过期返回false
         * @method Cora.store.noexpire
         * @param {string} key
         * @return noexpire
         */
        noexpire: function(key){
            if(key===void 0){
                return null;
            }
            var now = new Date().getTime(),
                data = parseval(storage.getItem(key));
            if(!data) return null;
            if(data.expire !== void 0 || data.expire <= now){
                this.del(key);
                return null;
            }
            return data.value;
        },
        get: function(key){
            if(key){
                return this.noexpire(key);
            }
            var ret = {};
            this.each(function(key, val){
                ret[key] = val;
            });
            return ret;
        },
        /**
         * 输出Debug执行时cpu信息, 在chrome profile面板查看相应详情
         * @method Cora.store.set
         * @param {string} key
         * @param {object} val OR(string)
         * @param {expire} expire 过期时间，此刻起的millsecond数 1000*60=1min后过期
         */
        set: function(key, val, expire){
            if(typeof key === 'string'){
                storage.setItem(key, bindtime(val, expire));
                return this;
            }
            var data = key;
            for (var k in data) {
                val = data[k];
                this.set(k, val, expire);
            }
        },
        del: function(key){
            storage.removeItem(key);
            return this;
        },
        cls:function(){
            storage.clear();
            return this;
        },
        has: function(key){
            return storage.hasOwnProperty(key);
        },
        size: function(unit){
            var bytes = JSON.stringify(localStorage).length
            if(!unit)
                return bytes;
            if(unit==='KB')
                return bytes/1024;
            if(unit==='MB')
                return bytes/1024/1024;
            return bytes;
        }
    };
    return store;
});