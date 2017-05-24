$(function(){
    $('.comment').click(function(e){
        var target=$(this);
        var toId=target.data('tid');
        var commentId=target.data('cid');
        var form=$('#comments form');
        if(form.has("input[name='comment[tid]']").length==0){
            $('<input>').attr({
                type: 'hidden',
                name: 'comment[tid]',
                value:toId
            }).prependTo('#comments form');
        }else{
            form.find("input[name='comment[tid]']").val(toId);
        }
        if(form.has("input[name='comment[cid]']").length==0) {
            $('<input>').attr({
                type: 'hidden',
                name: 'comment[cid]',
                value: commentId
            }).prependTo('#comments form');
        }else{
            form.find("input[name='comment[cid]']").val(commentId);
        }
    });
});
