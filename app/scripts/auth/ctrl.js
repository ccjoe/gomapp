define(['auth/model'], function(authModel) {
    'use strict';
    return {  
        init: function(helper, cr){
            helper.render(cr);
            this.login();
        },  

        login: function(){
            console.log(authModel, "authModel");
        },

        logout: function(){

        }
    };
});

