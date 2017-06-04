var PUBNUB_canvas;
var channelID_canvas = 'cocokua'+videoID+roomID+"_canvas";

PUBNUB_canvas = PUBNUB.init({
    publish_key: 'pub-c-9295f055-f256-4e51-9317-ba3b363a0769', 
    subscribe_key: 'sub-c-7577b584-ba0a-11e5-8365-02ee2ddab7fe',
    ssl : (('https:' == document.location.protocol) ? true : false)
});

/* 		brush;<canvasID>;<positionX>;<positionY>;<size>;<color>
 * 		text;<canvasID>;<text>;<positionX>;<positionY>;<size>;<color>
 * 		sticker;<canvasID>;<stickerID>;<positionX>;<positionY>
 * 		clear;<canvasID>
 */
PUBNUB_canvas.subscribe({
    channel: channelID_canvas,
    message: function(m){
        switch(m.function){
			case "moveTo":
				printCanvas(m);
				break;
			case "lineTo":
				printCanvas(m);
				break;
			case "text":
				printCanvas(m);
				break;
			case "sticker":
				printCanvas(m);
				break;
			case "clear":
				clearCanvas(getCanvasID(m.id));
				break;
		}
    }
});

function canvasBroadcast(func, id, x, y, color, size, data){
	PUBNUB_canvas.publish({
		channel: channelID_canvas,
		message: {
			"function": func,
			"id": id, //FB ID
			"x": x,
			"y": y,
			"color": color,
			"size": size,
			"data": data, //text or stickerID
			"user": userID
		}
	});
}



