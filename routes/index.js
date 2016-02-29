/**
 * This file is where you define your application routes and controllers.
 * 
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 * 
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 * 
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 * 
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 * 
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var i18n = require("i18n-2");
var _ = require('underscore');
var middleware = require('./middleware');
var nav = require('./nav');

var importRoutes = keystone.importer(__dirname);

// Add-in i18n support
// keystone.pre('routes', i18n.init);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views')
};

// Setup Route Bindings
exports = module.exports = function(app) {

	i18n.expressBind(app, {
	    // setup some locales - other locales default to en silently
	    locales: ['en', 'de'],
	    // change the cookie name from 'lang' to 'locale'
	    cookieName: 'lang',
	});

	app.use(middleware.initLanguage);
	app.use(middleware.initNav);

	// app.use(middleware.initStaticRoutes);

	nav.initStaticPageRoutes(app);


	//dynamic page routes
	app.get('/', routes.views.index);

	app.get('/news/updates', routes.views.updates);
	app.get('/news/updates/category/:category?', routes.views.updates);
	app.get('/news/updates/:post', routes.views.post);
	app.get('/news/press', routes.views.post);
	app.get('/news/press/:post', routes.views.post);
	app.get('/news/videos', routes.views.post);
	app.get('/news/videos/:post', routes.views.post);

	app.get('/nachrichten/updates', routes.views.updates);
	app.get('/nachrichten/updates/category/:category?', routes.views.updates);
	app.get('/nachrichten/updates/:post', routes.views.post);
	app.get('/nachrichten/press', routes.views.post);
	app.get('/nachrichten/press/:post', routes.views.post);
	app.get('/nachrichten/videos', routes.views.post);
	app.get('/nachrichten/videos/:post', routes.views.post);


	
	
	// app.get('/about', routes.views.about);
	// app.get('/about/where-we-work', routes.views['about-wherewework']);
	// app.get('/about/our-team', routes.views['about-ourteam']);
	// app.get('/about/our-students', routes.views['about-ourstudents']);
	// app.get('/about/supporters', routes.views['about-supporters']);
	// app.get('/about/financials', routes.views['about-financials']);

	app.all('/contact', routes.views.contact);
	
	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);
	
};



