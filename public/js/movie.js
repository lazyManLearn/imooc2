$(function(){
    $('#douban').blur(function(){
        var douban=$(this);
        var id=douban.val();
        if(id){
            $.ajax({
                url:"https://api.douban.com/v2/movie/subject/"+id,
                cache: true,
                type: 'get',
                dataType: 'jsonp',
                crossDomain: true,
                jsonpCallBack: 'callback',
                success: function(data){
                    var form=$('#movie');
                    form.find('input[name="movie[title]"]').val(data.title);
                    form.find('input[name="movie[doctor]"]').val(data.directors[0].name);
                    form.find('input[name="movie[country]"]').val(data.countries[0]);
                    form.find('input[name="movie[poster]"]').val(data.images['large']);
                    form.find('input[name="movie[year]"]').val(data.year);
                    form.find('textarea[name="movie[summary]"]').val(data.summary);
                }
            });
        }
    });
});
