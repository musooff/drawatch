var userFBID = "";
var userName = "";
var userPhotoURL = "";

/** Check login cookie **/
userFBID = getCookie("cocokua_user_id");
userName = getCookie("cocokua_user_name");
userPhotoURL = getCookie("cocokua_user_photo");
if(userFBID!="" && userName!="" && userPhotoURL!=""){
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
}

console.log("Nurzh kotak");

/** FB initial **/
window.fbAsyncInit = function() {
	FB.init({
		appId      : '272167629913460', //'227582124405805',//'771089149681169',//
		cookie     : true,
		xfbml      : true,
		version    : 'v2.8'
	});
	// FB.getLoginStatus(function(response) {
 //    	if(response.authResponse){
	// 		getUserInfo();
	// 	}
 //  	});
};
(function(d, s, id){
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) {return;}
	js = d.createElement(s); js.id = id;
	js.src = "//connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));

function login() {
	FB.getLoginStatus(function(response) {
		if(response.authResponse){
			getUserInfo();
		}
		else{
			FB.login(function(response) {
				if (response.authResponse) {
					getUserInfo();
				} else {
					//User cancelled login or did not fully authorize.
				}
			});
		}
	});
}

function logout() {
	deleteCookie("cocokua_user_id");
	deleteCookie("cocokua_user_name");
	deleteCookie("cocokua_user_photo");
	location.href = "/"; // redirect to home page
}

function getUserInfo() {
	FB.api('/me', function(response) {
		userFBID = response.id;
		userName = response.name;
		FB.api('/me/picture?width=30&height=30', function(response) {
			userPhotoURL = response.data.url;
			$("#userPhoto").attr("src", userPhotoURL);
			setCookie("cocokua_user_id", userFBID, 10);
			setCookie("cocokua_user_name", userName, 10);
			setCookie("cocokua_user_photo", userPhotoURL, 10);
		})
		$("#userName").css("padding", "0px 5px 0px 10px");
		$("#unfoldArrow").css("display", "inline-block" );
		$("#userName").html(userName);
		$("#userPhoto").attr("alt", userName);
		$("#userPhoto").attr("title", userName);
		$("#hidden_option").width($("#userState").width());
		if(document.getElementById('roomURL').value!=''){
					goRoom();
				}
	});
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
