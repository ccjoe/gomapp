define(['View', 'Modal', 'Select'], function(View, Modal, Select) {

    return {
        show: function(){
            var provinces = [], citys = [], districts = [];
            $.ajax({url: 'gom/src/data/district.json',
                global:false,
                success:function(data){
                provinces = _.pluck(data, 'name');
                citys = _.pluck(data[0].citys, 'name');
                districts =  _.pluck(data[0].citys[0].districts, 'name');
                console.log(data, provinces, citys, districts);
                new Select({data: {
                    title: '请选择区域',
                    cascade: false,
                    level: 3,
                    list: {'1':provinces,'2': citys, '3':districts},
                    onYes: function(val){
                        Modal.toast('选择的值为：' + val);
                    }
                }}).render();
            }});
        }
    }
});
