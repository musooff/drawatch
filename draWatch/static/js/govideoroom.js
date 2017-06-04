/** Function of buttons in main menu **/
$("#createbtn").click(function(){
	createRoom();
});
$("#gobtn").click(function(){
	goRoom();
});
$('#videoURL').on('keyup', function(event) {
    if (event.keyCode == 13 && $("#videoURL").val()!=""){
        createRoom();
	}
});
$('#roomURL').on('keyup', function(event) {
    if (event.keyCode == 13  && $("#roomURL").val()!=""){
		goRoom();
	}
});

$("#viewbtn").click(function(){
	swal({title: "Unavailable", text: "This function is not open yet", type: "error", confirmButtonColor: "#F27474"});
});


function createRoom(){
	if(userFBID==""){
		swal({title: "Please login first", text: "Click \"Log In\" button to login with your FB account", type: "error", confirmButtonColor: "#F27474"});
	}
	else{
		if($("#videoURL").val()==""){
			swal({title: "", text: "Please enter a Youtube Video URL", type: "error", confirmButtonColor: "#F27474"});
			return ;
		}
		var videoID = getYouTubeVideoID($("#videoURL").val());
		if(videoID.length==11){
			var roomID = makeRoomID();
			/**
			$.ajax({
				url: 'http://140.114.71.168/user.php',
				data: 'function=' + 'addRoomCanvas' +'&room=' + roomID +'&user=' + userFBID ,
				type: "POST",
				success: function(json) {

				}
			});**/
			location.href = "/r_"+videoID+"_n_"+roomID;
		} else{
			swal({title: "Wrong URL format", text: "Please enter an absolute URL", type: "error", confirmButtonColor: "#F27474"});
		}
		
	}
}
function goRoom(){
	if(userFBID==""){
		swal({title: "Please login first", text: "Click \"Log In\" button to login with your FB account", type: "error", confirmButtonColor: "#F27474"});
	}
	else{
		if($("#roomURL").val()==""){
			swal({title: "", text: "Please enter a CoCoKUA Video Room URL", type: "error", confirmButtonColor: "#F27474"});
			return ;
		}
		var url = $("#roomURL").val();
		var vars = url.split("_n_");
		vars[1] = vars[1].replace(/\//g, "");
		if(vars[0] && vars[1] && vars[1].length==11){//&& $("#roomURL").val().toLowerCase().indexOf("cocokua.herokuapp.com") >= 0
			location.href = url;
		} else{
			swal({title: "Wrong URL format", text: "Please enter an absolute URL", type: "error", confirmButtonColor: "#F27474"});
		}
	}	
}

/** YouTube Video ID parser **/
function getYouTubeVideoID(url){
  var ID = '';
  url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if(url[2] !== undefined) {
    ID = url[2].split(/[^0-9a-z_\-]/i);
    ID = ID[0];
  }
  else {
    ID = url;
  }
    return ID;
}

/** Make a room ID with 11 random characters **/
function makeRoomID(){
	var id = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for( var i=0; i < 11; i++ )
		id += possible.charAt(Math.floor(Math.random() * possible.length));
	return id;
}