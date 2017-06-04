var PUBNUB_chat;
var channelID = 'cocokua'+videoID+roomID;

PUBNUB_chat = PUBNUB.init({
        publish_key: 'pub-c-8b2af6e6-5e78-4909-b26a-14e2894e34b4',
        subscribe_key: 'sub-c-37fe5e96-1d07-11e6-b700-0619f8945a4f',
        ssl : (('https:' == document.location.protocol) ? true : false)

    });

// Subscribe to the channel
PUBNUB_chat.subscribe({
	channel: channelID,
	message: function(m){
		var message = m.text.replace(/\n/gi,"<br>");
		document.getElementById('textbox').innerHTML += '<div class="message">'+ message + '</div>';
		$('#textbox').scrollTop($('#textbox')[0].scrollHeight);// auto scroll down
	}
});

// Publish a simple message to the channel
function send(){
	var userName = $("#userName").html();
	var msg = $("#msgtextarea").val();
	if(msg!=""){
		msg = "<strong>"+ userName +" :</strong> "+ msg;
		PUBNUB_chat.publish({
			channel: channelID,
			message: {"text": msg}
		});
		$("#msgtextarea").val("");
	}	
}
function send_system_message(msg){
	var userName = $("#userName").html();
	var msg = userName + msg;
	console.log('msg '+msg);
	PUBNUB_chat.publish({
			channel: channelID,
			message: {"text": msg}
		});
}

$("#sendbutton").click(function(){
		send();
});

/**
	shift + enter => add new line
	enter => send
**/
$('#msgtextarea').on('keydown', function(event) {
    if (event.keyCode == 13){
        if (!event.shiftKey){
			send();
			return false;
		}
	}
});