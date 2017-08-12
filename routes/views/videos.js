var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals

	// Load the staff and board members in to two lists
	view.query(
        'videos',
        keystone.list('Video').model.find()
    );

	// Render the view
	view.render('videos');

};
