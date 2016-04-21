$( document ).ready(function() {
	$("#dob").datepicker({
		changeMonth: true,
		changeYear: true,
		yearRange: '1950:2016'		
	});
	$("#proposedstartdate").datepicker();
	$("#proposedenddate").datepicker();
});