var canvas=[] ;
canvas.push(document.getElementById("myCanvas1"));
canvas.push(document.getElementById("myCanvas2"));
canvas.push(document.getElementById("myCanvas3"));
canvas.push(document.getElementById("myCanvas4"));
canvas.push(document.getElementById("myCanvas5"));
var ctx = [canvas[0].getContext("2d"), canvas[1].getContext("2d"), canvas[2].getContext("2d"), canvas[3].getContext("2d"), canvas[4].getContext("2d")];
var mode = '';

var drawMode = false;
var lineCount = 0;
var mx, my;
var stickerWidth, stickerHeight;

var color;
var textSize;
var stickerID = 1;
var paintOn = 0;
var meUser;

var sclock = null;
var bclock = null;

function setCanvas(userCanvasID){
  document.getElementById('myCanvas'+(userCanvasID+1)).style.zIndex = 6;
  startCanvas(userCanvasID);
}

function startCanvas(userCanvasID){
	meUser = userCanvasID;

	//action binding
	canvas[meUser].onmousedown = function(ev){
		if(sclock!=null){
			clearTimeout(sclock);
			console.log('clear sclock: ' + sclock);
		}
		if(bclock!=null)clearTimeout(bclock);

		drawMode = true;
		//initialize
		ctx[meUser].beginPath();
		ctx[meUser].lineJoin = 'miter';
		ctx[meUser].shadowBlur = 0;
		ctx[meUser].globalAlpha = 1;
		mx = event.clientX - parseInt(canvas[meUser].style.left) - 8 + window.pageXOffset;
		my = event.clientY - parseInt(canvas[meUser].style.top) - 60 + window.pageYOffset;
		console.log('x = '+mx+' y = '+my);
		ctx[meUser].moveTo(mx, my);


		switch(mode){
			case "marker":
				selectBrushColor();
				stateBroadcast("bordercolor", userFBID, userName, userPhotoURL, color);
				selectLineWidth();
				canvasBroadcast("moveTo", userFBID, mx, my, color, ctx[meUser].lineWidth, "");
				lineCount = 0;
				break;
				
			case "text":
				selectTextColor();
				stateBroadcast("bordercolor", userFBID, userName, userPhotoURL, color);
				selectFontSize();
				var textValue = $("#word").val();
				tw = ctx[meUser].measureText(textValue).width;
				ctx[meUser].fillText(textValue, mx-tw/2, my+2);
				drawMode = false;
				canvasBroadcast("text", userFBID, mx-tw/2, my+2, color, textSize, textValue);
				break;

			case "sticker":
				stateBroadcast("bordercolor", userFBID, userName, userPhotoURL, "default");
				ctx[meUser].drawImage(document.getElementById(stickerID), mx-stickerWidth/2, my-stickerHeight/2, stickerWidth, stickerHeight);
				drawMode = false;
				canvasBroadcast("sticker", userFBID, mx, my, color, 0, stickerID);
				break;
		}
	}
   
	canvas[meUser].onmousemove = function(ev){
		if(drawMode && mode!=''){
			mx = event.clientX - parseInt(canvas[meUser].style.left)- 8 + window.pageXOffset;
			my = event.clientY - parseInt(canvas[meUser].style.top)- 60 + window.pageYOffset;
			if(lineCount<4){
				lineCount++;
			}
			else{
				canvasBroadcast("lineTo", userFBID, mx, my, color, ctx[meUser].lineWidth, "");
				ctx[meUser].lineTo(mx, my);
				ctx[meUser].stroke();
				lineCount = 0;
			}
		}
	}
   
	canvas[meUser].onmouseup = function(){
		drawMode = false;
		if (!paintOn) {
			//paintOn = 1;
			sclock = setTimeout(clearCanvas,2000,meUser);
			console.log('set sclock: ' + sclock);
			bclock = setTimeout(function(){
				canvasBroadcast("clear", userFBID, 0, 0, "", 0, "");
				stateBroadcast("bordercolor", userFBID, userName, userPhotoURL, 'default');
				//paintOn = 0;
			}, 2000);
		}
	}
	//action binding finish
}

function clearCanvas(id){
	ctx[id].clearRect(0, 0, canvas[id].width, canvas[id].height);
}

function printCanvas(obj){
    var user = getCanvasID(obj.id);   
    if(obj.user != userID){
		if (obj.function=="moveTo") {
			ctx[user].beginPath();
			ctx[user].lineJoin = 'miter';
			ctx[user].shadowBlur = 0;
			ctx[user].globalAlpha = 1;

			ctx[user].strokeStyle = obj.color;
			ctx[user].lineWidth = obj.size;
			ctx[user].moveTo(obj.x, obj.y);
		}
		else if(obj.function=="lineTo"){
            ctx[user].lineTo(obj.x, obj.y);
            ctx[user].stroke();
		}
		else if (obj.function=="text") {
			ctx[user].fillStyle = obj.color;
            ctx[user].font = obj.size+"px Comic Sans MS";
            ctx[user].fillText(obj.data, obj.x, obj.y);
		}
		else if (obj.function=="sticker") {
            var x = obj.x - $("#"+obj.data)[0].naturalWidth/2;
            var y = obj.y - $("#"+obj.data)[0].naturalHeight/2;
            ctx[user].drawImage(document.getElementById(obj.data), x, y);
		}
    }
}


/** function of option2 **/
var preview_brush = $("#preview_brush")[0].getContext("2d");
var preview_text = $("#preview_text")[0].getContext("2d");

function selectBrushColor(){
	ctx[meUser].strokeStyle = preview_brush.strokeStyle;
	color = ctx[meUser].strokeStyle;
}
function selectTextColor(){
	ctx[meUser].fillStyle = preview_text.fillStyle;
	color = ctx[meUser].fillStyle;
}
function selectLineWidth(){
	preview_brush.lineWidth = document.getElementById("lineWidth").value;
	ctx[meUser].lineWidth = preview_brush.lineWidth;	
}
function selectFontSize(){
  preview_text.font = (document.getElementById("fontSize").value*10)+"px Comic Sans MS";
  ctx[meUser].font = preview_text.font;
  textSize = document.getElementById("fontSize").value*10;
}
function showBrushPreview(){
	preview_brush.strokeStyle = document.getElementById("color_brush").value;
	preview_brush.fillStyle = "#FFFFFF";
	preview_brush.lineWidth = document.getElementById("lineWidth").value;
	var previewCanvas = document.getElementById("preview_brush");
	preview_brush.fillRect( 0, 0, previewCanvas.width, previewCanvas.height);
	preview_brush.moveTo(0, 50);
	preview_brush.lineTo(100, 50);
	preview_brush.stroke();
}
function showTextPreview(){
	preview_text.font = (document.getElementById("fontSize").value*10)+"px Comic Sans MS";
	preview_text.fillStyle = document.getElementById("color_text").value;
	preview_text.textAlign = "center";
	var previewCanvas = document.getElementById("preview_text");
	preview_text.textBaseline="middle";
	preview_text.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
	preview_text.fillText("Hi", previewCanvas.width/2, previewCanvas.height/2-5);
}

/** Tools click event **/
function setMode(m){
	mode = m;
}

$("#marker").click(function(){
	setMode(this.id);
	showSetting(this.id);
	showBrushPreview();
	$( "canvas" ).not( "#preview_text,#preview_brush" ).css("cursor", "crosshair");
});

$("#text").click(function(){
	setMode(this.id);
	showSetting(this.id);
	showTextPreview();
	$( "canvas" ).not( "#preview_text,#preview_brush" ).css("cursor", "text");
});

$("#sticker").click(function(){
	setMode(this.id);
	showSetting(this.id);
	stickerWidth = $("#"+stickerID)[0].naturalWidth;
	stickerHeight = $("#"+stickerID)[0].naturalHeight;
	$( "canvas" ).not( "#preview_text,#preview_brush" ).css("cursor", "url(../static/images/img/transparent_sticker/"+stickerID+"_t60.png) "+stickerWidth/2+" "+stickerHeight/2+", default");
});

$("#color_brush").on('change', function(){
	showBrushPreview();
});
$("#lineWidth").on('change', function(){
	showBrushPreview();
});
$("#color_text").on('change', function(){
	showTextPreview();
});
$("#fontSize").on('change', function(){
	showTextPreview();
});
$('#sticker-holder').on('click','.sticker-img',function(){
	stickerID = this.id;
	stickerWidth = $("#"+stickerID)[0].naturalWidth;
	stickerHeight = $("#"+stickerID)[0].naturalHeight;
	$( "canvas" ).not( "#preview_text,#preview_brush" ).css("cursor", "url(../static/images/img/transparent_sticker/"+stickerID+"_t60.png) "+stickerWidth/2+" "+stickerHeight/2+", default");
});
$("#canvasonoffswitch").change(function() {
    if(this.checked) {
		$('#myCanvas1, #myCanvas2, #myCanvas3, #myCanvas4, #myCanvas5').css("display", "block");
    }
	else{
		$('#myCanvas1, #myCanvas2, #myCanvas3, #myCanvas4, #myCanvas5').css("display", "none");
	}
});