var stickerNum = 44;

addSticker();

function addSticker(){
	var i=0;
	for(i=1;i<=stickerNum;i++){
		var holder = document.getElementById('sticker-holder');
		var img = document.createElement('img');
		img.src = '../static/images/img/sticker/'+i+'.png';
		img.style.height = '80px';
		img.id = i;
		img.className='sticker-img';
		img.style.marginLeft = '15px';
		holder.appendChild(img);
	}
}
function showSetting(mode){
	$('.setting').removeClass('show');
	$('.'+mode).addClass('show');
}

var holderWidth = $("#sticker-holder").width();

$("#rightBtn").click(function(){
	$("#sticker-holder").animate({
		scrollLeft: $("#sticker-holder").scrollLeft() + holderWidth
	}, 700,function(){});   
	if($("#sticker-holder").scrollLeft()==$('#sticker-holder').css('left')){
		$("#rightBtn").css("display", "none");
	}else{
		$("#rightBtn").css("display", "true");
	}
});
 
$("#leftBtn").click(function(){
	$("#sticker-holder").animate({
		scrollLeft: $("#sticker-holder").scrollLeft() - holderWidth
	}, 700,function(){}); 
	if($("#sticker-holder").scrollLeft()==$('#sticker-holder').css('left')){
		$("#leftBtn").css("display", "none");
	}else{
		$("#leftBtn").css("display", "true");
	}
});


