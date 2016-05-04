$( document ).ready(function() {
	$('.ourstudents').slick({
		infinite: true,
		slidesToShow: 2,
		speed: 100,
		slidesToScroll: 1
	});
	$('.ourstudents-small').slick({ 
		infinite: true,
	 	slidesToShow: 1,
	 	speed: 100,
		slidesToScroll: 1
	});
});