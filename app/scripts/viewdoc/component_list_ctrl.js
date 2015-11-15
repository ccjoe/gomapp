define(function() {
    'use strict';
    return {
        init: function(page){
            var viewList = {
                    header: {
                        name: 'header头部设置',
                        hash: 'viewdoc/header'
                    },
                    list: {
                        name: '列表设置',
                        hash: 'viewdoc/list'
                    },
                    modal:{
                        name: 'modal',
                        hash: 'viewdoc/modal'
                    },
                    button:{
                        name: 'button',
                        hash: 'viewdoc/button'
                    },
                    tips:{
                        name: 'tips',
                        hash: 'viewdoc/tips'
                    },
                    dialog:{
                        name: 'dialog',
                        hash: 'viewdoc/dialog'
                    },
                    scroll:{
                        name: 'scroll',
                        hash: 'viewdoc/scroll'
                    },
                    switch:{
                        name: 'switch',
                        hash: 'viewdoc/switch'
                    },
                    tab:{
                        name: 'tab',
                        hash: 'viewdoc/tab'
                    },
                    slide:{
                        name: 'slide',
                        hash: 'viewdoc/slide'
                    },
                    radio:{
                        name: 'radio',
                        hash: 'viewdoc/radio'
                    },
                    select:{
                        name: 'select',
                        hash: 'viewdoc/select'
                    },
                    footer:{
                        name: 'footer设置',
                        hash: 'viewdoc/footer'
                    }
            };

            page.data = viewList;
            page.render();
        }
    };
});

