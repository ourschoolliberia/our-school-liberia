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

exports.getLanguage = function(req, res, next) {
	res.locals.siteLanguage = res.getLocale();
	next();
}

exports.initLanguage = function(req, res, next) {
	var siteLanguage = res.getLocale();
	if(req.query.setlanguage) {
		// console.log('language', req.query.setlanguage);
		res.cookie('siteLanguage', req.query.setlanguage, { maxAge: 900000, httpOnly: true });
		siteLanguage = req.query.setlanguage;
		res.setLocale(req.query.setlanguage);
	} 

	res.locals.siteLanguage = siteLanguage;
	console.log('siteLangage', siteLanguage);

	next();
}


exports.initNav = function(req, res, next) {
	var __ = res.__;
	
	res.locals.navLinks = [
		{ label: 'Home',		key: 'home',		href: '/' },
		{ label: __('about'),		key: 'about',		href: '/about', children: 
			[
				{ label: __('about-whatwedo'),		key: 'about-whatwedo',	 	href: '/about/what-we-do'  	},
				{ label: 'Where We Work',	key: 'where-we-work',	href: '/about/where-we-work'},
				{ label: 'Our Team',		key: 'our-team',		href: '/about/our-team'  	},
				{ label: 'Our Students',	key: 'our-students',	href: '/about/our-students' },
				{ label: 'Supporters',		key: 'supporters',		href: '/about/supporters'  	},
				{ label: 'Financials',		key: 'financials',		href: '/about/financials'  	}
			]
		},
		{ label: 'Donate',		key: 'donate',	href: '/donate'  },
		{ label: 'Get Involved',key: 'get-involved',	href: '/get-involved', children:
			[
				{ label: 'Subscribe',		key: 'subscribe',		href: '/get-involved/subscribe' },
				{ label: 'Events',			key: 'events',			href: '/get-involved/events'  	},
				{ label: 'Fundraise',		key: 'fundraise',		href: '/get-involved/fundraise' },
				{ label: 'Volunteer',		key: 'volunteer',		href: '/get-involved/volunteer' }
			]
		},
		{ label: 'News',		key: 'news',		href: '/news', children:
			[
				{ label: 'Updates',		key: 'updates',		href: '/news/updates'  },
				{ label: 'Press',		key: 'press',		href: '/news/press'  },
				{ label: 'Videos',		key: 'videos',		href: '/news/videos'  }

			]
		},
		// { label: 'Gallery',		key: 'gallery',		href: '/gallery' },
		{ label: 'Contact',		key: 'contact',		href: '/contact' }
	];

	next();
}
