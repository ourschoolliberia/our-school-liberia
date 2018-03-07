// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();

// Require keystone
var keystone = require('keystone');
var keystoneMultilingual = require('keystone-multilingual');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
	'name': 'Our School Liberia',
	'brand': 'Our School Liberia',

	'cloudinary config': process.env.CLOUDINARY_URL,
	'sass': 'public',
	'static': 'public',
	'admin path': 'admin',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'pug',
	'signin logo': '/images/logo@2x.jpg',

	'emails': 'templates/emails',

	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
	'cookie secret': 'XW)Kb1t54s_MnM@"*`8`_gulw/*.LW94s_C>{NkG@ixc<-!i"X)/ox]:nVAb6"gb',
});

//must initialise before importing models
keystoneMultilingual.init(keystone);

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js

keystone.set('locals', {
	_: require('underscore'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable
});


// Load your project's Routes
keystone.set('routes', require('./routes'));


// Setup common locals for your emails. The following are required by Keystone's
// default email templates, you may remove them if you're using your own.

keystone.set('email locals', {
	logo_src: '/images/logo-email.gif',
	logo_width: 194,
	logo_height: 76,
	theme: {
		email_bg: '#f9f9f9',
		link_color: '#2697de',
		buttons: {
			color: '#fff',
			background_color: '#2697de',
			border_color: '#1a7cb7'
		}
	}
});

// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	'news': [
		'updates',
		'videos',
		'press-releases',
		'categories',
		'galleries',
	],
	'get-involved': [

	],
	'about': [
		'students',
		'team-members',
		'supporter-individuals',
		'supporter-companies',
	],
	'enquiries': 'enquiries',
	'users': 'users'
});

// Start Keystone to connect to your database and initialise the web server

keystone.start();
