$( document ).ready(function() {
	$('.gallery').poptrox({
		preload: true,
		usePopupCaption: true,
		usePopupEasyClose: false,
		useBodyOverflow: true,
		caption: { selector: "section", remove: true }
	});
});
