var keystone = require('keystone');
var Subscriber = keystone.list('Subscriber');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// Set locals
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.formSubmitted = false;

	view.on('init', function (next) {
		
		// supply an array of languages available to the template
		keystone.list('Language').model.find().exec(function(err, languages){
			console.log(languages);
			locals.languages = languages.map(lang => ({ label: lang.name, value: lang._id }));
			next();
		})
	});
	
	// On POST requests, add the Subscriber item to the database
	view.on('post', { action: 'subscribe' }, function(next) {
		var newSubscriber = new Subscriber.model();
		var updater = newSubscriber.getUpdateHandler(req);

		console.log(req.body);
		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, email, preferredLanguage',
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
	
	view.render('get-involved-subscribe');
	
};


