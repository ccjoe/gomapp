define(function() {
    'use strict';

    var config = {
        url: 'http://h5.jc.me:3000/api/',
        returnClass: '.icon-left-nav',
        successCode: '00000',
        storeViewTmpl: false,
        viewExpire: 1000*60*60*12,
        selector: {
            wrapper: '#viewport',
            header: '#header',
            footer: '#footer',
            content: '#content'
        }
    };

    return config;
});
