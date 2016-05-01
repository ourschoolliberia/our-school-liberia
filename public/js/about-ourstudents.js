$( document ).ready(function() {
	$('.ourstudents').slick({
		infinite: true,
		slidesToShow: 2,
		slidesToScroll: 1
	});
	$('.ourstudents-small').slick({ 
		infinite: true,
	 	slidesToShow: 1,
		slidesToScroll: 1
	});
});