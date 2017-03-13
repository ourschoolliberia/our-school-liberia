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
 *
 * Templates are either specified as a sharedTemplate (the name of a template view)
 * or as a templatePrefix, which will have -en -de appended on and expect that template
 * view to exist.
 * 
 */

module.exports = {

	'home': {
		controller: routes.views.index,
		section: null,
		route: '/'
	},
	'donate': {
		section: 'donate',
		controller: false,
		templatePrefix: 'donate',
		languages: {
			'en': {
				route: 'https://www.paypal.com/uk/cgi-bin/webscr?cmd=_flow&SESSION=KDejKRgqsioDSOssCnGatJ-UwbbeIfWry4l8zOEHl15rOb0C2uDLJ8DXdm4&dispatch=5885d80a13c0db1f8e263663d3faee8dcce3e160f5b9538489e17951d2c62172',
			},
			'de': {
				route: 'https://www.paypal.com/uk/cgi-bin/webscr?cmd=_flow&SESSION=KDejKRgqsioDSOssCnGatJ-UwbbeIfWry4l8zOEHl15rOb0C2uDLJ8DXdm4&dispatch=5885d80a13c0db1f8e263663d3faee8dcce3e160f5b9538489e17951d2c62172',
			},
		}
	},
	'about': {
		section: 'about',
		controller: false,
		templatePrefix: 'about',
		languages: {
			'en': {
				route: '/about',
			},
			'de': {
				route: '/etwa',
			},
		},
		children: {
			whatwedo: {
				section: 'about',
				controller: false,
				templatePrefix: 'about-whatwedo',
				// sharedTemplate: 'about-whatwedo',
				languages: {
					'en': {
						route: '/about/what-we-do',
					},
					'de': {
						route: '/etwa/vhat-ve-do',
					},
				}
			},
			wherewework: {
				section: 'about',
				controller: false,
				templatePrefix: 'about-wherewework',
				languages: {
					'en': {
						route: '/about/where-we-work',
					},
					'de': {
						route: '/etwa/wo-wir-arbeiten',
					},
				}
			},
			ourteam: {
				section: 'about',
				controller: routes.views.teammembers,
				sharedTemplate: 'about-ourteam',
				languages: {
					'en': {
						route: '/about/our-team',
					},
					'de': {
						route: '/etwa/unser-team',
					},
				}
			},
			ourstudents: {
				section: 'about',
				controller: routes.views.students,
				languages: {
					'en': {
						route: '/about/our-students',
					},
					'de': {
						route: '/etwa/unser-studenten',
					},
				}
			},
			supporters: {
				section: 'about',
				controller: false,
				sharedTemplate: 'about-supporters',
				languages: {
					'en': {
						route: '/about/supporters',
					},
					'de': {
						route: '/etwa/unterstutzer',
					},
				}
			},	
		}
	},
	'getinvolved': {
		section: 'getinvolved',
		controller: false,
		sharedTemplate: 'get-involved',
		languages: {
			'en': {
				route: '/get-involved',
			},
			'de': {
				route: '/sich-einlassen',
			},
		},
		children: {
			subscribe: {
				section: 'getinvolved',
				controller: false,
				sharedTemplate: 'get-involved-subscribe',
				languages: {
					'en': {
						route: '/get-involved/subscribe',
					},
					'de': {
						route: '/sich-einlassen/abonnieren',
					},
				}
			},
			fundraise: {
				section: 'getinvolved',
				controller: false,
				sharedTemplate: 'get-involved-fundraise',
				languages: {
					'en': {
						route: '/get-involved/fundraise',
					},
					'de': {
						route: '/sich-einlassen/fundraising',
					},
				}
			},
			volunteer: {
				method: 'all',
				section: 'getinvolved',
				controller: routes.views.volunteer,
				languages: {
					'en': {
						route: '/get-involved/volunteer',
					},
					'de': {
						route: '/sich-einlassen/sich-freiwillig-melden',
					},
				}
			},
			
		}
	},
	news: {
		section: 'getinvolved',
		controller: false,
		sharedTemplate: 'get-involved',
		languages: {
			'en': {
				route: '/get-involved',
			},
			'de': {
				route: '/sich-einlassen',
			},
		},
		children: {
			'updates': {
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
			'updates:post': {
				section: 'news',
				controller: routes.views.update,
				languages: {
					'en': {
						route: '/news/updates/:post'
					},
					'de': {
						route: '/newsen/updaten/:post'
					}
				}
			},
			'updates.category:category': {
				section: 'news',
				controller: routes.views.updates,
				languages: {
					'en': {
						route: '/news/updates/category/:category'
					},
					'de': {
						route: '/newsen/updaten/category/:category'
					}
				}
			},
			
		}
	},
	'contact': {
		controller: routes.views.contact,
		section: 'contact',
		route: '/contact',
		method: 'all'
	},
	// 'gallery': {
	// 	section: 'gallery',
	// 	controller: false,
	// 	sharedTemplate: 'gallery',
	// 	languages: {
	// 		'en': {
	// 			route: '/gallery',
	// 		},
	// 		'de': {
	// 			route: '/fototelier',
	// 		},
	// 	}
	// },
}
