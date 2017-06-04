// ui
var phone;
$(function() {
    $( "#draggable" ).draggable({
  		opacity: 0.35
	});
	$('#open-video').click(createVideoPhone);
	$('#open-audio').click(createAudioPhone);
  });

//Pubnub
function createVideoPhone(){
	var phoneNumber = userFBID;
	phone = window.phone = PHONE({
	        number        : phoneNumber,
	        publish_key   : 'pub-c-e49a7f87-3523-474f-8342-b1a913fe8963',
	        subscribe_key : 'sub-c-08dadbe6-30ab-11e6-be83-0619f8945a4f',
	        ssl           : true,
	        media         : { audio : true, video : true},
    });
	phone.ready(function(){
	    $("#call").on('click',function(){
			makeCall();
		});
	});
	phone.receive(function(session){
	    session.connected(VideoConnected);
	    session.ended(VideoEnded);
	});
	//$('#phone-on').hide();
	$('#call').show();
	// $('#phone-off').show();
	// $('#phone-off').click(function(){
	// 	phone=null;
	// 	phone = window.phone = PHONE({
	//         number        : 'x',
	//         publish_key   : 'pub-c-9295f055-f256-4e51-9317-ba3b363a0769',
	//         subscribe_key : 'sub-c-7577b584-ba0a-11e5-8365-02ee2ddab7fe',
	//         ssl           : true,
 //   		 });
	// 	$('#call').hide();
	// 	$('#phone-on').show();
	// 	$('#phone-off').hide();
	// });
}
function createAudioPhone(){
	var phoneNumber = userFBID;
	phone = window.phone = PHONE({
	        number        : phoneNumber,
	        publish_key   : 'pub-c-e49a7f87-3523-474f-8342-b1a913fe8963',
	        subscribe_key : 'sub-c-08dadbe6-30ab-11e6-be83-0619f8945a4f',
	        ssl           : true,
	        media         : { audio : true, video : false },
	    });
	phone.ready(function(){
	    $("#call").on('click',function(){
			makeCall();
		});
	});
	phone.receive(function(session){
	    session.connected(AudioConnected);
	    session.ended(AudioEnded);
	});
	//$('#phone-on').hide();
	$('#call').show();
	// $('#phone-off').show();
	// $('#phone-off').click(function(){
	// 	phone=null;
	// 	phone = window.phone = PHONE({
	//         number        : 'x',
	//         publish_key   : 'pub-c-9295f055-f256-4e51-9317-ba3b363a0769',
	//         subscribe_key : 'sub-c-7577b584-ba0a-11e5-8365-02ee2ddab7fe',
	//         ssl           : true,
 //   		 });
	// 	$('#call').hide();
	// 	$('#phone-on').show();
	// });
}
function makeCall(){
	setLocalVideo();

	//members is defined in memberlist.js
    var sessions = [];
    	for (i=0;i<members.length;i++){
    		if(members[i]!=userFBID)
    			sessions.push(phone.dial(members[i]));
    	}
    	if(sessions!=[]){
    		sessions.forEach(function(friend){
			    friend.connected(function(session){ /* call connected */ });
			    friend.ended(function(session){     /* call ended     */ });
			});
    	}		
}
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Receiver for Calls
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function VideoConnected(session) {
	var newId = 'video-display-'+session.number;
	var container = document.getElementById('videoChat');
	var videoChat = document.getElementById('draggable');
	if(document.getElementById(newId)==null){

		var cln = videoChat.cloneNode(true);
		cln.style.display="block";
		$( cln ).draggable({
	  		opacity: 0.35
		});
		container.appendChild(cln); 
		
		$(cln).find('#video-display').attr('id',newId);
		$(cln).find('#hangup').attr('id','hangup-'+session.number);
		$(cln).find('#facetime').attr('id','facetime-'+session.number);
		$(cln).find('#earphone').attr('id','earphone-'+session.number);
		console.log(newId);
	}
	var video_out = PUBNUB.$(newId);
	video_out.innerHTML = '';
    video_out.appendChild(session.video);
    //bind pubnub event
    PUBNUB.bind( 'mousedown,touchstart', PUBNUB.$('hangup-'+session.number), function() {
	        session.hangup();
    } );
    PUBNUB.bind( 'mousedown,touchstart', PUBNUB.$('facetime-'+session.number), function() {
  	     phone.dial(session.number);

    } );
    var id='#facetime-'+session.number; //hide call btn
    $(id).hide();
    var id='#hangup-'+session.number;  //show hangup btn
    $(id).show();
    var id='#'+newId;
    $(id).parent().find('#close').hide(); //hide close btn
 	setLocalVideo();
    console.log("Hi!");
}
function AudioConnected(session) {
	var newId = 'video-display-'+session.number;
	var container = document.getElementById('videoChat');
	var videoChat = document.getElementById('draggable');
	if(document.getElementById(newId)==null){

		var cln = videoChat.cloneNode(true);
		cln.style.display="block";
		$( cln ).draggable({
	  		opacity: 0.35
		});
		container.appendChild(cln); 
		
		$(cln).find('#video-display').attr('id',newId);
		$(cln).find('#hangup').attr('id','hangup-'+session.number);
		$(cln).find('#earphone').attr('id','earphone-'+session.number);
		$(cln).find('#facetime').attr('id','facetime-'+session.number);
		console.log(newId);
	}
	var video_out = PUBNUB.$(newId);
	video_out.innerHTML = '';
    video_out.appendChild(session.video);
    //bind pubnub event
    PUBNUB.bind( 'mousedown,touchstart', PUBNUB.$('hangup-'+session.number), function() {
	        session.hangup();
    } );
    PUBNUB.bind( 'mousedown,touchstart', PUBNUB.$('earphone-'+session.number), function() {
  	     phone.dial(session.number);

    } );
    var id='#earphone-'+session.number; //hide call btn
    $(id).hide();
    var id='#facetime-'+session.number; //hide call btn
    $(id).hide();
    var id='#hangup-'+session.number;  //show hangup btn
    $(id).show();
    var id='#'+newId;
    $(id).parent().find('#close').hide();
 	setLocalVideo();
    console.log("Hi!");
}

function VideoEnded(session){
	console.log('Bye '+session.number);
	var id = '#facetime-'+session.number;
	$(id).show();
	var id = '#earphone-'+session.number;
	$(id).hide();
	var id = '#hangup-'+session.number;
	$(id).hide();
	var ele = '#video-display-'+session.number;
	$(ele).html('<span class="glyphicon glyphicon-facetime-video"></span>') ;
	$(ele).parent().find('#close').show();
	$(ele).parent().find('#close').click(function(){
		$(ele).parent().remove();
	});
}
function AudioEnded(session){
	console.log('Bye '+session.number);
	var id = '#earphone-'+session.number;
	$(id).show();
	var id = '#facetime-'+session.number;
	$(id).hide();
	var id = '#hangup-'+session.number;
	$(id).hide();
	var ele = '#video-display-'+session.number;
	$(ele).html('<span class="glyphicon glyphicon-ban-circle"></span>') ;
	$(ele).parent().find('#close').show();
	$(ele).parent().find('#close').click(function(){
		$(ele).parent().remove();
	});
}
function setLocalVideo(){
	//show my video
	var container = document.getElementById('draggable-me');
	var videoDisplay = document.getElementById('video-display-me');
	if(container.style.display=='none'){
		container.style.display="block";
		$( container ).draggable({
	  		opacity: 0.35
		});
		videoDisplay.innerHTML = '';
		$(videoDisplay).append(phone.video);	
		$(videoDisplay).parent().find('#close').click(function(){
			$(videoDisplay).parent().hide();
		});
	}
}
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Video Session Ended
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function set_icon(ele,icon) {
    $(ele).innerHTML = '<span class="glyphicon glyphicon-' +
        icon + '"></span>';
}
