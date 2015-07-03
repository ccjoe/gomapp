define(function() {
    'use strict';
    _.templateSettings = {
      interpolate: /\{\{(.+?)\}\}/g
    };
    var tools = {
        getCookie: getCookie,
        setCookie: setCookie,
        delCookie: delCookie,
        getUrl: getUrl, //获取URL上各部件信息
        setUrl: setUrl, //设置URL
        parseUrl: parseUrl, //解析URL参数为对象
        getCodeTime: getCodeTime,
        objRemoveKV: objRemoveKV, //过滤除去key为value的对象，返回原coll
        objFindKV: objFindKV,     //过滤找出key为value的对象
        mapArrToMap: mapArrToMap, //将Map数组转换为Map类型
        arrToMap: arrToMap,       //将数组转换为Map类型
        arrToStr: arrToStr,       // Array TO String
        objToStr: objToStr,       // Object TO String
        decodeHtml: decodeHtml
    };

    function getCookie(key) {
        var aCookie = window.document.cookie.split(";");
        for (var i = 0; i < aCookie.length; i++) {
            var aCrumb = aCookie[i].split("=");
            if (key === aCrumb[0].replace(/^\s*|\s*$/, "")) {
                return unescape(aCrumb[1]);
            }
        }
    }

    function setCookie(c_name, value, expire) {
        var date = new Date(),
            endTime = date.getTime() + expire;
        var expire = expire ? ';expires=' + new Date(endTime) : '';
        document.cookie = c_name + "=" + escape(value) + expire;
    }

    function delCookie(name) {
            var date = new Date();
            date.setTime(date.getTime() - 10000);
            document.cookie = name + "=v; expires=" + date.toGMTString();
        }
        //1=>URL,
        //2=>传入key,返回value,
        // 传入 'hash' 返回hash名，
        // 传入 'search' 返回kv字符串,
        // 传入 'domain' 返回.com|.net ~~~,
        // 否则返回key:value obj;

    function getUrl(url, keyOrObj) {
        //对url进行decodeURIComponen解码
        url = decodeURIComponent(url);
        var hashsearch = url.substr(url.indexOf('#') + 2);

        var pos = hashsearch.indexOf('?');

        if (!!~pos) {
            var hash = hashsearch.substr(0, pos),
                search = hashsearch.substr(pos + 1),
                kvArr = search.split('&');
        } else {
            var hash = hashsearch,
                search = '',
                kvArr = [];
        }

        var kvObj = {};
        for (var i = 0; i < kvArr.length; i++) {
            var kvi = kvArr[i];
            kvObj[kvi.substr(0, kvi.indexOf('='))] = kvi.substr(kvi.indexOf('=') + 1);
        }

        if (typeof keyOrObj === 'string') {
            if (keyOrObj === 'hash') {
                return hash;
            }
            if (keyOrObj === 'search') {
                return search;
            }
            if (keyOrObj === 'domain') {
                var durl = /http:\/\/([^\/]+)\//i,
                    domain = str.match(durl);
                return domain[1].substr(domain[1].lastIndexOf('.') + 1);
            }
            return kvObj[keyOrObj];
        }

        return kvObj;
    }

    //传入key,value 或 obj,均自动解析
    // serialize| single=Single&multiple=Multiple&multiple=Multiple3&check=check2&radio=radio1
    function setUrl(url, keyValueOrObj, value) {
        if (typeof keyValueOrObj === 'string') {
            var kvpair = keyValueOrObj + '=' + value;
            if (!~url.indexOf('?')) {
                return url + '?' + kvpair;
            } else {
                return url + '&' + kvpair;
            }
        } else if (typeof keyValueOrObj === 'object') {
            var kvpair = $.param(keyValueOrObj);
            if (!~url.indexOf('?')) {
                return url + '?' + kvpair;
            } else {
                return url + '&' + kvpair;
            }
        }
    }


    // 将字符串键值对解析为对象
    // paramPaser('a=1&b=2', '&', '=');
    function parseUrl(string, identitor1, identitor2) {
        var o = {},
            key, value;
        var arr = string.split(identitor1);
        for (var i in arr) {
            key = arr[i].split(identitor2)[0],
                value = arr[i].split(identitor2)[1];
            o[key] = value;
        };
        return o;
    }


    //过滤除去key为value的对象，返回原coll
    function objRemoveKV(coll, key, value) {
        $.each(coll, function(i, item) {
            if (item[key] === value) {
                coll = _.without(coll, item);
            }
        });
        return coll;
    }

    //过滤找出key为value的对象，返回此对象
    function objFindKV(coll, key, value) {
        var ret = {};
        $.each(coll, function(i, item) {
            if (item[key] === value) {
                ret = item;
            }
        });
        return ret;
    }

    //[{1:'test'},{2:'test2'}] => {1:'test',2:'test2'}
    function mapArrToMap(array) {
        var mapArrObj = {};
        $.each(array, function(i, item) {
            for (var j in item) {
                mapArrObj[j] = item[j];
            }
        });
        return mapArrObj;
    }

    //[{a:1,b:'test'},{a:2,b:'test2'}] => {1:'test',2:'test2'}
    //将键为a,b的值转化为键值对
    function arrToMap(array, a, b) {
        var mapObj = {};
        $.each(array, function(i, item) {
            mapObj[item[a]] = item[b];
        });
        return mapObj;
    }

    //array/obj to String(for develop && make data)
    function arrToStr(arr) {
        if (typeof arr !== 'object' || !arr.length) {
            return [];
        }
        var str = '[';
        for (var i = 0; i < arr.length; i++) {
            (function(n) {
                console.log(n, arr.length - 1, str);
                if (n !== arr.length - 1) {
                    str += objectToString(arr[n]) + ',';
                } else {
                    str += objectToString(arr[n]) + '';
                }

            })(i);
        }

        str += ']';

        return str;
    }

    //kv to STring
    function objToStr(obj) {
        if (typeof obj !== 'object') {
            return {};
        }
        var objstr = '{',
            index = 0;
        for (var key in obj) {
            index++;
            if (typeof obj[key] !== 'function') {
                if (index !== Object.keys(obj).length) {
                    objDivStr = ',';
                } else {
                    objDivStr = '';
                }
                objstr += key + ':' + '"' + obj[key] + '"' + objDivStr;
            }
        }
        objstr += '}';
        return objstr;
    }

    function dom2str(dom) {
        var el = document.createElement("div");
        el.appendChild(dom);
        return el.innerHTML;
    }

    function decodeHtml(s) {
        var REGX_HTML_DECODE = /&\w+;|&#(\d+);/g,
            HTML_DECODE = {
                "&lt;": "<",
                "&gt;": ">",
                "&amp;": "&",
                "&nbsp;": " ",
                "&quot;": "\"",
                "&copy;": "©"

                // Add more
            };
        return (typeof s != "string") ? s :
            s.replace(REGX_HTML_DECODE,
                function($0, $1) {
                    var c = HTML_DECODE[$0]; // 尝试查表
                    if (c === undefined) {
                        // Maybe is Entity Number
                        if (!isNaN($1)) {
                            c = String.fromCharCode(($1 == 160) ? 32 : $1);
                        } else {
                            // Not Entity Number
                            c = $0;
                        }
                    }
                    return c;
                });
    }

    return tools;
});
