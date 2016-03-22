var _ = require('underscore');
var invariant = require('invariant');
var i18n = require("i18n-2");
var keystone = require('keystone');

var Router = require('named-routes');
var router = new Router();

var localeNavMap = require('./localeNavMap');
var localeRouteMap = require('./localeRouteMap');


var LocaleRouter = {

	init: function (app) {

		this.app = app.bind(app);

		// Configure i18n bindings
		i18n.expressBind(app, {
		    // setup some locales - other locales default to en silently
		    locales: ['en', 'de'],
		    // change the cookie name from 'lang' to 'locale'
		    cookieName: 'lang',
		});

		//setup named routes
		router.extendExpress(app);
		router.registerAppHelpers(app);

		this.app.use(this.setLocaleFromCookie.bind(this));
		this.app.use(this.setLocaleFromQueryString.bind(this));
		this.app.use(this.setNavigationForLocale.bind(this));

		this.generateRoutes();
	},

	/**
	 * Sets the locale from the cookie if it exists
	 */
	setLocaleFromCookie: function (req, res, next) {
		req.i18n.setLocaleFromCookie();
		next();
	},

	/**
	 * Sets locale from query string if it is passed and sets the cookie for it
	 */
	setLocaleFromQueryString: function (req, res, next) {
		var oldLocale, currentLocale;

		oldLocale = currentLocale = req.i18n.getLocale();

		if(req.query.language) {
			currentLocale = req.query.language;

			if(oldLocale != currentLocale) {
				this.setLocaleAndCookie(req, res, currentLocale);
				res.locals.localeChange = true;
				res.locals.oldLocale = oldLocale;
			}
		} 
		next();
	},
	
	/**
	 * fetch the correct navigation for current language
	 */
	setNavigationForLocale: function (req, res, next) {
		res.locals.navLinks = this.getNavigationForLocale(req.i18n.getLocale());
		next();
	},


	/**
	 * read through the language route map and generate the 
	 * dynamic and static routes for each.
	 */
	generateRoutes: function () {
		var languages = ['en', 'de'];

		_(localeRouteMap).each((page, routeName) => {
			var routeFn = page.method && 'function' === typeof this.app[page.method] 
				? this.app[page.method].bind(this.app) 
				: this.app.get.bind(this.app)
			;
			
			invariant((typeof page.section !== 'undefined'), "Page section required, can be null");

			if(page.languages) {
				_(languages).each((lang) => { 
					var langPage = page.languages[lang];
					var langRouteName = lang + '.' + routeName;

					if (!langPage)
						return; //No entry for this langauge on this page..??

					invariant(langPage.route, "Each language requires a route to be specified");
					
					if (page.controller) {
						this.createDynamicRoute(routeFn, langRouteName, langPage.route, page.controller);
					} else if (page.templatePrefix) {
						var template = page.templatePrefix + '-' + lang;
						this.createStaticRoute(routeFn, langRouteName, langPage.route, template, page.section)
					
					} else {
						invariant(page.sharedTemplate, "If no controller is passed then either a templatePrefix or a sharedTemplate is expected");
						this.createStaticRoute(routeFn, langRouteName, langPage.route, page.sharedTemplate, page.section)
					}
				});
			} else {
				invariant(
					page.controller && page.route, 
					"If no languages are specified, a generic route and controller must be specified"
				);

				//allows all language switching to be done in controller/template (home page)
				this.createDynamicRoute(routeFn, '*.' + routeName, page.route, page.controller);

			}

		});
	},




	/**
	 * Middleware to run before all routes
	 * Specified as initial handler for all generated routes as it requires access
	 * to req.route.name
	 *
	 * When changing language this will redirect the page to the localised route if 
	 * there is such a route matching in the localeRouteMap.
	 *
	 * When not changing language, this will ensure the locale is set to the language 
	 * of the localised route if specified in the localeRouteMap (and update the nav)
	 */
	localeController: function (req, res, next) {
			
		if(res.locals.localeChange) {
			this.redirectToLocalisedRoute(req, res, next);
		} else {
			this.setLanguageFromRoute(req, res, next);
		} 

	},

	/**
	 * Checks if a route exists for the given request in the current language;
	 * This runs: 
	 * 	- 	whenever the language is switched to find a seperate 
	 * 	- 	if a view does a lookup for an alternate translation it can update the key parameter
	 * 		and call this again to redirect.
	 */
	redirectToLocalisedRoute: function (req, res, next) {
		var currentRouteName = req.route.name;
		var redirectUrl;
		var routeName = this.getRouteNameForLocale(req.i18n.getLocale(), currentRouteName);
		
		if(routeName) {

			if(req.app.namedRoutes.routesByNameAndMethod[routeName] 
				&& req.app.namedRoutes.routesByNameAndMethod[routeName][req.method.toLowerCase()]) {
				
				console.log('REDIRECT', currentRouteName + ' to ' + routeName);
				redirectUrl = req.app.namedRoutes.build(routeName, req.params)
				res.redirect(redirectUrl);
				return;
			} else {

				//no localised route for the content
				console.log('route not available');
				req.flash('info', req.i18n.__('langRouter.routeNotAvailable'));
				next();
			}
		} else {
			next();
		}
	},

	/**
	 * if the route browsed to is from another locale than current, insist we're in that locale
	 */
	setLanguageFromRoute: function (req, res, next) {
		var currentLang = req.i18n.getLocale();
		var routeLang = this.getLocaleFromRouteName(req.route.name);

		if(routeLang && routeLang !== currentLang) {
			this.setLocaleAndCookie(req, res, currentLang);
			
			//HACK: (is it hacky?) 
			//redo the nav fetch for the new langauge
			res.locals.navLinks = this.getNavigationForLocale(currentLang);
		}
		next();
	},


	setLocaleAndCookie: function (req, res, locale) {
		req.i18n.setLocale(locale);
		res.cookie('lang', locale, { maxAge: 900000, httpOnly: true });
	},

	getNavigationForLocale: function (locale) {

		invariant(locale, "No Locale provided");
		invariant(localeNavMap[locale], "No Locale found for " + locale);

		return localeNavMap[locale];
	},

	createDynamicRoute: function (routeFn, routeName, routePath, controller) {
		console.log('DYNAMIC ROUTE', routeName); 
		routeFn(routePath, routeName, this.localeController.bind(this), controller);
	},


	createStaticRoute: function (routeFn, routeName, routePath, template, section) {

		console.log('STATIC ROUTE', routeName + ' (with template: ' + template + ')'); 
		routeFn(routePath, routeName, this.localeController.bind(this), function (req, res) {
			var view = new keystone.View(req, res);
			var locals = res.locals;

			// locals.section is used to set the currently selected
			// item in the header navigation.
			locals.section = section;
			
			// Render the view to the template
			view.render(template);
		});
	},

	/**
	 * This basically just switches the first component of the route to the new 
	 * language, returning null for universal routes (*)
	 */

	getRouteNameForLocale: function (newLang, routeName) {
		var redirectRouteName;
		var routeSplit = routeName.split('.');

		if('*' === routeSplit[0]) {
			//this is an all language match, return no route
			redirectRouteName = null;
		} else {
			var routeLang = routeSplit.shift();
			routeSplit.unshift(newLang)
			redirectRouteName = routeSplit.join('.');
		}

		return redirectRouteName;
	},

	getLocaleFromRouteName: function (langRouteName) {
		var routeSplit = langRouteName.split('.');
		var locale;

		if('*' === routeSplit) {
			locale = null;
		} else {
			locale = routeSplit.shift();
		}
		
		return locale;
	}
};


exports.init = LocaleRouter.init.bind(LocaleRouter);
exports.redirectToLocalisedRoute = LocaleRouter.redirectToLocalisedRoute.bind(LocaleRouter);;


