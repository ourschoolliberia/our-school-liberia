$( document ).ready(function() {
	$('.gallery').poptrox({
		preload: true,
		usePopupCaption: true,
		caption: { selector: "section", remove: true }
	});
});