$(window).scroll(function(){
    if($(this).scrollTop() >=300){
        $('.topBtn') .fadeIn();
    }else{
        $('.topBtn') .fadeOut();
    }	
});

$('.topBtn').click(function(e){
    e.preventDefault();
    $('html, body').stop().animate({scrollTop:0},500);
});