var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// Set locals
	locals.section = 'about';
	
	// Load the galleries by sortOrder
	view.query('teammembers', keystone.list('TeamMember').model.find());
	
	// Render the view
	view.render('about-ourteam');
	
};
