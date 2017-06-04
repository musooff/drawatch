var userFBID = "";
var userName = "";
var userPhotoURL = "";

/** Check login cookie **/
userFBID = getCookie("cocokua_user_id");
userName = getCookie("cocokua_user_name");
userPhotoURL = getCookie("cocokua_user_photo");
if(userFBID!="" && userName!="" && userPhotoURL!=""){
	//addMember(userFBID,roomID);
	$("#userName").html(userName);
	$("#userName").css("padding", "0px 5px 0px 10px");
	$("#unfoldArrow").css("display", "inline-block" );
	$("#userPhoto").attr("src", userPhotoURL);
	$("#userPhoto").attr("alt", userName);
	$("#userPhoto").attr("title", userName);
	$("#hidden_option").width($("#userState").width());
	setCookie("cocokua_user_id", userFBID, 1);
	setCookie("cocokua_user_name", userName, 1);
	setCookie("cocokua_user_photo", userPhotoURL, 1);
	
	var isChrome = !!window.chrome && !!window.chrome.webstore;
	if(!isChrome){
		swal({
			imageUrl: "../static/images/Chrome.ico",
			title: "",
			text: "To ensure you get the best experience on CoCoKUA,<br>we recommend you to use <strong>Chrome</strong> browser.",
			confirmButtonText:"OK, I know",
			html: true
		});
	}
	setTimeout(function(){ setVideo(); }, 500);
}
else{
	//alert("Please login first."); //can't use sweetalert
	location.href = "/i_"+ videoID+ "_n_"+ roomID;
}

function logout() {
	deleteCookie("cocokua_user_id");
	deleteCookie("cocokua_user_name");
	deleteCookie("cocokua_user_photo");
	location.href = "/"; // redirect to home page
}

/** hidden options **/
$("#userBar").hover(
	function(){
		if(userFBID!="")
			$("#hidden_option").css("display", "block" );
	},
	function(){
		$("#hidden_option").css("display", "none" );
	}
);

var ishidden = true;

$("#userState").click(
	function(){
		if(userFBID==""){
			login();
		}
		else{
			if(ishidden){
				$("#hidden_option").css("display", "block" );
				$("#userBar").off('mouseenter mouseleave');
				ishidden = false;
			}
		}
	}
);

$(document).click(function(e){
	if(!$(e.target).is("#userState") && !$(e.target).parent().is("#userState")) {
		$("#hidden_option").css("display", "none" );
		$("#userBar").hover(
			function(){
				if(userFBID!="")
					$("#hidden_option").css("display", "block" );
			},
			function(){
				$("#hidden_option").css("display", "none" );
			}
		);
		ishidden = true;
	}
});

$("#logout").click(function(){
		logout();
});
