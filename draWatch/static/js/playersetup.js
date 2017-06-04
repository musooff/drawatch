var playerVars = {
	modestbranding: 1,
	theme: 'light',
	showinfo: 0,
	rel: 0,
	fs: 0
};

var vidSync;
var player;
var userID;

function setVideo(){
	/* var videosync = new VideoSync("roomId", "userId");
	 *
	 * The roomId should be the same for all the clients you want to sync, 
	 * and the userId should be different for all the clients.
	 */
	userID = makeUserID();
	vidSync = new VideoSync(videoID+"_"+roomID, userID);
	player = new YT.Player('player', {
		height: '480',
		width: '854',
		videoId: videoID,
		playerVars: playerVars,
		events: {
			'onReady': vidSync.onPlayerReady,
			'onStateChange': vidSync.onPlayerStateChange
		}
	});
}

function makeUserID(){
	var id = userFBID;
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for( var i=0; i < 5; i++ )
		id += possible.charAt(Math.floor(Math.random() * possible.length));
	return id;
}


//TODO: check user id whether it has been used or not.


/** 
	The API will call this function when the page has finished 
	downloading the JavaScript for the player API.

function onYouTubeIframeAPIReady() {
	//setVideo();
}
**/