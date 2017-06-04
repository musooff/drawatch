
$('.display').hover(
	function(){
		$(this).children('.slide2').fadeIn();
	},
	function(){
		$(this).children('.slide2').fadeOut();
	}
);