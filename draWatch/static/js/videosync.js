// VideoSync is an API that synchronizes the playback of embedded 
// YouTube videos across multiples browsers.
// 
// You can check out the demo right [here](http://larrywu.com/videosync/), or
// view the source on [Github](https://github.com/lw7360/videosync/)


// Setup
// ---
// roomId is the name of the channel you want to use.
// userId is an optional variable that will identify individual users of VideoSync.
function VideoSync(roomId, userId) {
    // If no userId is provided, generate a simple random one with Math.random.
    if (userId === undefined) {
        userId = Math.random().toString();
    }

    // A variable that will be set to the YouTube player object.
    var player;

    // Initializing PubNub with demo keys and our userId.
    var pubnub = PUBNUB.init({
        publish_key: 'pub-c-8b2af6e6-5e78-4909-b26a-14e2894e34b4',
        subscribe_key: 'sub-c-37fe5e96-1d07-11e6-b700-0619f8945a4f',
        uuid: userId,
        ssl : true
    });

    // Whether the connection to the channel has been established yet.
    var linkStart = false;

    // The contents of the most recently received message.
    var lastMsg;

    // A helper function that publishes state-change messages.
    var pub = function (type, time) {
        console.log(time+' pb '+type);
        if (lastMsg !== "" + type + time) {
			var sendTime = $.now();
            pubnub.publish({
                channel: roomId,
                message: {
                    recipient: "",
                    sender: userId,
                    type: type,
                    time: time,
					sendtime: sendTime
                }
            });
        }
    };

    // The function that keeps the video in sync.
    var keepSync = function () {
        // [Link Start!](https://www.youtube.com/watch?v=h7aC-TIkF3I&feature=youtu.be)
        linkStart = true;

        // The initial starting time of the current video.
        var time = player.getCurrentTime();

        // Subscribing to our PubNub channel.
        pubnub.subscribe({
            channel: roomId,
            callback: function (m) {
                lastMsg = m.recipient + m.type + m.time;
                if ((m.recipient === userId || m.recipient === "") && m.sender !== userId) {
                    if (m.type === "updateRequest") {
                        var curState = player.getPlayerState();
                        if(curState == 0){
                            console.log('pb YT ended');
                        }
                        else if (curState == 1){
                            console.log('pb YT playing');
							var curTime = player.getCurrentTime();
							var sendTime = $.now();
							pubnub.publish({
								channel: roomId,
								message: {
									type: "play",
									time: curTime,
									recipient: m.sender,
									sender: userID,
									sendtime: sendTime
								}
							});
						} else if (curState ==2) {
                            console.log('pb YT pauseed');
							var curTime = player.getCurrentTime();
							var sendTime = $.now();
							pubnub.publish({
								channel: roomId,
								message: {
									type: "pause",
									time: curTime,
									recipient: m.sender,
									sender: userID,
									sendtime: sendTime
								}
							});                            
						}
                    }
					else if (m.type === "pause") {
                        console.log('sb YT pause');
                        player.seekTo(m.time, true);
                        time = m.time;
                        player.pauseVideo();          
                    } else if (m.type === "play") {
                        console.log('sb YT play');
                        if (m.time !== null) {
							var delay = Math.ceil(($.now()-m.sendtime)/1000);
							player.seekTo(m.time+delay, true);
                        }
                        player.playVideo();
                    }
                }
            },
			connect: function(){
				pubnub.publish({
					channel: roomId,
					message: {
						recipient: "",
						sender: userID,
						type: "updateRequest",
						time: null
					}
				});
			},
            presence: function (m) {}
        });

        // Intermittently checks whether the video player has jumped ahead or
        // behind the current time.
        var z = setInterval(function () {
            var curTime = player.getCurrentTime();
            var curState = player.getPlayerState();
            if (Math.abs(curTime - time) > 1) {
                if (curState === 2) {
                    pub("pause", curTime);
                    player.pauseVideo();
                } else if (curState === 1) {
                    player.pauseVideo();
                }
            }
            time = curTime;
        }, 10);
    };

    // Public Methods
    // ---
    return {
        // Should be bound to the YouTube player `onReady` event.
        onPlayerReady: function (event) {
            player = event.target;
            //event.target.playVideo();
            event.target.pauseVideo();
             keepSync();
        },
        // Should be bound to the YouTube player `onStateChange` event.
        onPlayerStateChange: function (event) {
            if (linkStart) {
                // Play event.
                if (event.data === 1) {
                    pub("play", null);
                   
					//document.getElementById('myCanvas1').style.display="block";
					//document.getElementById('myCanvas2').style.display="block";
					//document.getElementById('myCanvas3').style.display="block";
					//document.getElementById('myCanvas4').style.display="block";
					//document.getElementById('myCanvas5').style.display="block";
                }
                // Pause event.
                else if (event.data === 2) {
                    pub("pause", player.getCurrentTime());

                }
            }
        }
    };
}