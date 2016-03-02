var keystone = require('keystone');
var importRoutes = keystone.importer(__dirname);

// Import Route Controllers
var routes = {
	views: importRoutes('./views')
};


/**
 * Langages can either share a route or specify explicit route paths.
 *
 * The key is the name of the route, not the path. it is used to lookup 
 * respective routes for alternate languages.
 *
 * If the controller is set to false, it is assumed to be a static page
 * in this case the template needs to be specified.
 */

module.exports = {

	'home': {
		controller: routes.views.index,
		route: '/'
	},
	// 'about.index': {
	// 	controller: false,
	// 	templatePefix: 'about',
	// 	languages: {
	// 		'en': {
	// 			route: '/about',
	// 		},
	// 		'de': {
	// 			route: '/etwa',
	// 		},
	// 	}
	// },
	'about.whatwedo' : {
		controller: false,
		section: 'about',
		templatePrefix: 'about-whatwedo',
		languages: {
			'en': {
				route: '/about/what-we-do',
			},
			'de': {
				route: '/etwa/vhat-ve-do',
			},
		}
	},
	// 'about.wherewework' : {
	// 	controller: false,
	// 	templatePefix: 'about-wherewework',
	// 	languages: {
	// 		'en': {
	// 			route: '/about/where-we-work',
	// 		},
	// 		'de': {
	// 			route: '/etwa/wo-wir-arbeiten',
	// 		},
	// 	}
	// },
	'news.updates': {
		section: 'news',
		controller: routes.views.updates,
		languages: {
			'en': {
				route: '/news/updates'
			},
			'de': {
				route: '/newsen/updaten'
			}
		}
	},
	'news.updates:post': {
		controller: routes.views.updates,
		languages: {
			'en': {
				route: '/news/updates/:post'
			},
			'de': {
				route: '/newsen/updaten/:post'
			}
		}
	},
	'news.updates.category:category': {
		controller: routes.views.updates,
		languages: {
			'en': {
				route: '/news/updates/category/:category'
			},
			'de': {
				route: '/newsen/updaten/category/:category'
			}
		}
	}
}
