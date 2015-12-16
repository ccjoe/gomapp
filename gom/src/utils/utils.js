/**
 * tools 封装
 * @author Joe Liu
 * @email icareu.joe@gmail.com
 */

define(function() {
    /**
     * @method Gom.Utils
     */
    var Utils = {
        version: '1.0.0',

        isWebApp: /http(s)?:\/\//.test(location.protocol),
    };
    return Utils;
});
