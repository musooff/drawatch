$(function(){
	var url = window.location.href;
	var par1 = url.split("\//");
	var par2 = par1[1].split("\/");
	var par3 = par2[1].split(/_n_|i_/g);
	var videoID = par3[1];
	var roomID = par3[2];

	if(videoID!=undefined && roomID!=undefined){
		console.log('invited');
		document.getElementById('roomURL').value= "http://"+par2[0]+"/r_"+videoID+"_n_"+roomID;
		$('.bubble').css('display','block');
		$('#gobtn').css('background-color','red');
		$('#gobtn').css('border','1px solid #AD4135');
	}
});