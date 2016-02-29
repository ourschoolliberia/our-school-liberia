/**
 * This file contains the common middleware used by your routes.
 * 
 * Extend or replace these functions as your application requires.
 * 
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */

var _ = require('underscore');
var nav = require('./nav');

/**
	Initialises the standard view locals
	
	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/

exports.initLocals = function(req, res, next) {
	
	var locals = res.locals;
	locals.user = req.user;

	next();
	
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/

exports.flashMessages = function(req, res, next) {
	
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error')
	};
	
	res.locals.messages = _.any(flashMessages, function(msgs) { return msgs.length; }) ? flashMessages : false;
	
	next();
	
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */

exports.requireUser = function(req, res, next) {
	
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}
	
};

// exports.getLanguage = function(req, res, next) {
	
// 	res.locals.siteLanguage = req.cookie('siteLanguage') || res.getLocale();
// 	next();
// }

exports.initLanguage = function(req, res, next) {
	var oldLanguage, siteLanguage;
	
	req.i18n.setLocaleFromCookie();
	oldLanguage = siteLanguage = req.i18n.getLocale();
	
	console.log("we're in: ", siteLanguage);
	if(req.query.setlanguage) {
		res.cookie('lang', req.query.setlanguage, { maxAge: 900000, httpOnly: true });
		siteLanguage = req.query.setlanguage;
// 		var redirect = nav.findRedirectForLang(oldLanguage, siteLanguage, req.path);
// console.log("REDIRECT", redirect);
		req.i18n.setLocale(siteLanguage);
		console.log("But now we're in: ", siteLanguage);
	} 

	res.locals.siteLanguage = siteLanguage;

	next();
}


exports.initNav = function(req, res, next) {

	//res.__ is a call to the i18n module, it retrieves the sitemap either in EN or DE pending language 
	res.locals.navLinks = req.i18n.__('sitemapping');
	next();
}


exports.initStaticRoutes = function (req, res, next) {

	res.app.get('/about/what-we-do', function (req, res) {
		var view = new keystone.View(req, res);
		var locals = res.locals;
		
		// locals.section is used to set the currently selected
		// item in the header navigation.
		locals.section = 'about';
		
		// Render the view, view is named as the key
		view.render('about-whatwedo');
	});

	next();
}





