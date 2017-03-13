var keystone = require('keystone');
var VolunteerSubmission = keystone.list('VolunteerSubmission');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// Set locals
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.formSubmitted = false;
	
	// On POST requests, add the VolunteerSubmission item to the database
	view.on('post', { action: 'volunteer' }, function(next) {
		
		var newVolunteerSubmission = new VolunteerSubmission.model(),
			updater = newVolunteerSubmission.getUpdateHandler(req);
		
		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, email, dob, proposedStartDate, proposedEndDate, email, areasOfInterest, qualifications, teacherQualifications, more',
			errorMessage: 'There was a problem registering your interest:'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals.formSubmitted = true;
			}
			next();
		});
		
	});
	
	view.render('get-involved-volunteer');
	
};


