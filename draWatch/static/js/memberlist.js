var PUBNUB_background;
var channelID_background = 'cocokua'+videoID+roomID+"_background";
var members = [];
var canvasID = -1;

PUBNUB_background = PUBNUB.init({
    publish_key: 'pub-c-9295f055-f256-4e51-9317-ba3b363a0769', 
    subscribe_key: 'sub-c-7577b584-ba0a-11e5-8365-02ee2ddab7fe',
	uuid: userFBID,
	ssl : (('https:' == document.location.protocol) ? true : false)
});

/* 		newuser;<FB Photo URL>;<FB Name>;<FB ID>
 * 		olduser;<FB Photo URL>;<FB Name>;<FB ID>
 * 		bordercolor;<FB ID>;<color/'none'>
 */
PUBNUB_background.subscribe({
    channel: channelID_background,
    message: function(m){
        switch(m.function){
			case "bordercolor":
				if(m.data=="default")
					$("#photo_"+m.id).css("box-shadow", "none");
				else
					$("#photo_"+m.id).css("box-shadow", "0px 0px 6px 6px "+ m.data);
				break;
		}
    },
	presence: function(m){
		var u = m.data;
        switch(m.action){
			case "join":
				if(u!=undefined){
					if(document.getElementById("photo_"+u.id)==null){
						document.getElementById('members').innerHTML += "<img id='photo_"+u.id+"' class='member' src="+u.photo+" alt="+u.name+" title="+u.name+">";
					}
					addMember(u.id);
				}
				else{
					PUBNUB_background.state({
						channel: channelID_background,
						uuid: m.uuid,
						callback: function(u){
							if(document.getElementById("photo_"+u.id)==null){
								document.getElementById('members').innerHTML += "<img id='photo_"+u.id+"' class='member' src="+u.photo+" alt="+u.name+" title="+u.name+">";
							}
							addMember(u.id);
						}
					});
				}
				break;
			case "state-change":
				break;
			case "timeout":
				clearCanvas(getCanvasID(m.uuid));
				removeMember(m.uuid);
				break;
			case "leave":
				clearCanvas(getCanvasID(m.uuid));
				removeMember(m.uuid);
				break;
		}
    },
	state: {
		id: userFBID,
		name: userName, 
		photo: userPhotoURL
	}
});

function stateBroadcast(func, id, name, photo, data){
	PUBNUB_background.publish({
		channel: channelID_background,
		message: {
			"function": func,
			"id": id, //FB ID
			"name": name,
			"photo": photo,
			"data": data
		}
	});
}

function addMember(id){
	var index = members.indexOf(id);
	if(index==-1){
		index = members.length;
		members[index] = id;
	}
	if(id == userFBID){
		canvasID = index;
		setCanvas(canvasID);
	}
	return index;
}

function removeMember(id){
	var index = members.indexOf(id);
	if(index>-1){
		members.splice(index, 1);
	}
	var now = members.indexOf(userFBID);
	if(canvasID!=now){
		var temp = members[now];
		members[now] = members[canvasID];
		members[canvasID] = temp;
	}
	$("#photo_"+id).remove();
}

//FB ID -> canvas ID
function getCanvasID(id){
	index = members.indexOf(id);
	if(index==-1){
		index = canvasID;
	}
	return index;
}

/** Invite Friends **/
window.fbAsyncInit = function() {
	FB.init({
		appId      : '227582124405805',//
		cookie     : true,
		xfbml      : true,
		version    : 'v2.8'
	});
	
	$("#invitebutton").css("display", "block" );
};
(function(d, s, id){
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) {return;}
	js = d.createElement(s); js.id = id;
	js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.8&appId=227582124405805";
	fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));

$("#invitebutton").click(function(){
	var vars = window.location.href.split("\/");
	var url = /*vars[2]*/ "letsyoutube.herokuapp.com" + "/r_"+ videoID+ "_n_"+ roomID;
	console.log(url);	
	// url = "letsyoutube.herokuapp.com/r_2cf9xo1S134_n_fYP9GNbZMfy";
	// console.log(url);
	if(userFBID!=""){
		$("#invitebutton").prop('disabled', true);
		if(members.length>=5){
			swal({title: "Unavailable", text: "Sorry, one room can only accommodate 5 people.", type: "error", confirmButtonColor: "#F27474"});
		}
		FB.ui(		{
			method: 'send',
			link: url,
		}, function(response) {
			$("#invitebutton").prop('disabled', false);
			if (response && !response.error_message) {
				swal({
					title: "Invitation is sent",
					text: "",
					type: "success",
					confirmButtonColor: "#89B770"
				});
			}
		});
	}
});
