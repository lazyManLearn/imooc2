$(function(){
    var id=0;
    $('.del').click(function(e){
        var target= $(e.target);
        id=target.data('id');
        var tr=$('.item-id-'+id);
        var username=tr.find('.username').text();
        $('#messageModal .modal-body p').addClass('text-danger').text('你真的要删除用户：'+username+'吗?');
    });
    $('#messageModal .confirm').click(function(){
        var tr=$('.item-id-'+id);
        $('#messageModal').modal('hide');
        $.ajax({
            type: 'DELETE',
            url: '/admin/user/update?id='+id
        }).done(function(res){
            if(res.success==1){
                if(tr.length>0){
                    tr.remove();
                }
            }
        });
    });
});
