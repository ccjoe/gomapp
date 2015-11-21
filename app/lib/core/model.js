define(['base/ui/ui.modal'], function(Modal){
    var loading;

    $(document).on('ajaxBeforeSend', function(e, xhr, options){
        loading = Modal.loading();
    }).on('ajaxComplete', function(e, xhr, options){
        loading.toggleModal('Out');
    });

    var Model = function(){
        this.url = '';
        this.data = data;
    };
});
