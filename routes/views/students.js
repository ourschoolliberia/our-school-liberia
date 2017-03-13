var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// Load the students
	view.query('students', keystone.list('Student').model.find());
	
	// Render the view
	view.render('about-ourstudents');
	
};
