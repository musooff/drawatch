$(document).ready(function() {

      // Initialize the plugin
      $('#slide').popup({
        outline: false, // optional
        focusdelay: 400, // optional
        vertical: 'center', //optional
        align: 'center',
        escape: true,
        color: '#000',
        onclose: function() {
          var output = '';
          document.getElementById("infoPlayer").innerHTML = output;
        }
      });
	  
	  $("#infovideobtn").css("cursor", "pointer");
	  $("#infovideobtn").hover(
		function(){
			$("#infovideobtn img").css("width", "70px")
		},
		function(){
			$("#infovideobtn img").css("width", "50px")
		}
	  );
	  

      $('#infovideobtn').click(function(){
        var output = "";
		if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
			output = '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/3jotMgKtVwk" frameborder="0" allowfullscreen></iframe>';
		}
		else{
			output = '<iframe width="640" height="390" src="https://www.youtube.com/embed/3jotMgKtVwk" frameborder="0" allowfullscreen></iframe>';
		}
        document.getElementById("infoPlayer").innerHTML = output;
        
      });

      
});
