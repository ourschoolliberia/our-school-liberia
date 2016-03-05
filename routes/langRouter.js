var _ = require('underscore');
var invariant = require('invariant');
var keystone = require('keystone');
var middleware = require('./middleware');

var langNavMap = require('./langNavMap');
var langRouteMap = require('./langRouteMap');


exports.init = function(app) {
	app.use(initLanguage);
	generateRoutes(app);
}

exports.flashContentUnavailable = function (req) {
	req.flash('info', "Sorry but this content is not yet available in the selected language")
}


function initLanguage (req, res, next) {
	var oldLanguage, currentLanguage;
	var setLanguage = false;
	req.i18n.setLocaleFromCookie();
	oldLanguage = currentLanguage = req.i18n.getLocale();
	
	console.log("we're in: ", currentLanguage);
	if(req.query.setlanguage) {
		currentLanguage = req.query.setlanguage;

		if(oldLanguage != currentLanguage) {
			req.i18n.setLocale(currentLanguage);
			res.cookie('lang', currentLanguage, { maxAge: 900000, httpOnly: true });
			res.locals.langaugeSwitch = true;
			res.locals.oldLanguage = oldLanguage;
		}
	} 
	
	//fetch the correct navigation for current language
	res.locals.navLinks = getLangNav(currentLanguage);
	next();
}

function generateRoutes (app) {
	var languages = ['en', 'de'];

	_(langRouteMap).each(function (page, routeName) {
		//consider adding other methods..
		var routeFn = page.all ? app.all.bind(app) : app.get.bind(app);
		
		invariant((typeof page.section !== 'undefined'), "Page section required, can be null");

		if(page.languages) {
			_(languages).each(function (lang) { 
				var langPage = page.languages[lang];
				var langRouteName = lang + '.' + routeName;

				if (!langPage)
					return; //?

				invariant(langPage.route, "Each language requires a route to be specified");
				
				if (page.controller) {
					createDynamicRoute(routeFn, langRouteName, langPage.route, page.controller);
				} else if (page.templatePrefix) {
					var template = page.templatePrefix + '-' + lang;
					createStaticRoute(routeFn, langRouteName, langPage.route, template, page.section)
				
				} else {
					invariant(page.sharedTemplate, "If no controller is passed then either a templatePrefix or a sharedTemplate is expected");
					createStaticRoute(routeFn, langRouteName, langPage.route, page.sharedTemplate, page.section)
				}
			});
		} else {
			invariant(page.controller && page.route, "If no languages are specified, a generic route and controller must be specified");


			//allows all language switching to be done in controller (home page)
			createDynamicRoute(routeFn, '*.' + routeName, page.route, page.controller);

		}

	});
};




/**
 * Middleware to run before all routes
 * Specified as a handler for all routes as it requires access to the req.route.name
 *
 * When changing language this will redirect the page to the localised route if there is such 
 * a route matching in the langRouteMap.
 *
 * When not changing language, this will ensure the locale is set to the language of the localised route
 * if specified in the langRouteMap (and update the nav)
 */
function languageRouteRedirect(req, res, next) {
	var currentLang = req.i18n.getLocale();
	
	if(res.locals.langaugeSwitch) {
		// redirect to the localised route;
		var oldLang = res.locals.oldLanguage;
		var currentRouteName = req.route.name;
		var redirectUrl;

		var routeName = findRouteNameForLang(oldLang, currentLang, currentRouteName);
		
		if(routeName) {

			if(req.app.namedRoutes.routesByNameAndMethod[routeName] 
				&& req.app.namedRoutes.routesByNameAndMethod[routeName][req.method.toLowerCase()]) {
				
				var redirectUrl = req.app.namedRoutes.build(routeName, req.params)
				console.log('REDIRECT', currentRouteName + ' to ' + routeName);
				res.redirect(redirectUrl);
				return;
			} else {
				//no localised route for the content
				exports.flashContentUnavailable(req);
			}
		}
	} else {

		//if the route browsed to is from another language lets insist we're in that language
		//but only if we're not currently changing language...

		var routeLang = getLangFromRouteName(req.route.name)
		if(routeLang && routeLang !== currentLang) {
			req.i18n.setLocale(routeLang);
			res.locals.siteLanguage = routeLang;
			res.cookie('lang', routeLang, { maxAge: 900000, httpOnly: true });
			
			//HACK: (is it?) redo the nav for the new langauge
			res.locals.navLinks = getLangNav(currentLang);
		}
	} 

	next();
}



function getLangNav (lang) {

	invariant(lang, "No Language provided");
	invariant(langNavMap[lang], "No Language found for " + lang);

	return langNavMap[lang];
}

function createDynamicRoute(routeFn, routeName, routePath, controller) {
	console.log('DYNAMIC ROUTE', routeName); 
	routeFn(routePath, routeName, languageRouteRedirect, controller);
}


function createStaticRoute(routeFn, routeName, routePath, template, section) {

	console.log('STATIC ROUTE', routeName + ' (with template: ' + template + ')'); 
	routeFn(routePath, routeName, languageRouteRedirect, function (req, res) {
		var view = new keystone.View(req, res);
		var locals = res.locals;

		// locals.section is used to set the currently selected
		// item in the header navigation.
		locals.section = section;
		
		// Render the view to the template
		view.render(template);
	});
}

function findRouteNameForLang (oldLang, newLang, langRouteName) {
	//this basically just switches the 
	var redirectRouteName;
	var routeSplit = langRouteName.split('.');

	if('*' === routeSplit[0]) {
		//this is an all language match, return no route
		redirectRouteName = null;
	} else {
		var routeLang = routeSplit.shift();
		routeSplit.unshift(newLang)
		redirectRouteName = routeSplit.join('.');
	}

	return redirectRouteName;
}

function getLangFromRouteName (langRouteName) {
	var routeSplit = langRouteName.split('.');
	var routeLang;

	if('*' === routeLang) {
		routeLang = null;
	} else {
		routeLang = routeSplit.shift();
	}
	
	return routeLang;
}
