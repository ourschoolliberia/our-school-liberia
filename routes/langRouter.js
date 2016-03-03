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
		console.log(routeName);
		
		invariant((typeof page.section !== 'undefined'), "Page section required, can be null");

		if(page.languages) {
			_(languages).each(function (lang) { 
				var langPage = page.languages[lang];
				var langRouteName = lang + '.' + routeName;
				
				if (!langPage)
					return;

				if(langPage.route) {
					if (page.controller) {
						createDynamicRoute(app, langRouteName, langPage.route, page.controller);
					} else if (page.templatePrefix) {
						var template = page.templatePrefix + '-' + lang;
						createStaticRoute(app, langRouteName, langPage.route, template, page.section)
					} else {
						invariant(page.sharedTemplate, "If no controller is passed then either a templatePrefix or a sharedTemplate is expected");
						createStaticRoute(app, langRouteName, langPage.route, page.sharedTemplate, page.section)
					}
				} else {
					throw "No route found";
				}
				console.log(langPage.route);
			});
		} else if (page.controller && page.route) {

			//allows all language switching to be done in controller (home page)
			createDynamicRoute(app, routeName, page.route, page.controller);

		}

	});
};

function getLangNav (lang) {

	invariant(lang, "No Language provided");
	invariant(langNavMap[lang], "No Language found for " + lang);

	return langNavMap[lang];
}



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
			var redirectUrl = req.app.namedRoutes.build(routeName, req.params)
			console.log('redirecting from ' + currentRouteName + ' to ' + routeName);
			res.redirect(redirectUrl);
			return;
		}
	} else {

		//if the route browsed to is from another language lets insist we're in that language
		//but only if we're not currently changing language...

		var routeLang = getLangFromRouteName(req.route.name)
		if(routeLang && routeLang !== currentLang) {
			req.i18n.setLocale(routeLang);
			res.locals.siteLanguage = routeLang;
			res.cookie('lang', routeLang, { maxAge: 900000, httpOnly: true });
			
			//HACK: (is it?) redo the nav
			res.locals.navLinks = getLangNav(currentLang);
		}
	} 

	next();
}


function createDynamicRoute(app, routeName, routePath, controller) {
	console.log('creating route for ' + routeName); 
	app.get(routePath, routeName, languageRouteRedirect, controller);
}


function createStaticRoute(app, routeName, routePath, template, section) {

	app.get(routePath, routeName, languageRouteRedirect, function (req, res) {
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
	var routeSplit = langRouteName.split('.');
	var routeLang = routeSplit.shift();
	routeSplit.unshift(newLang)
	var redirectRouteName = routeSplit.join('.');
	return redirectRouteName;
}

function getLangFromRouteName (langRouteName) {
	var routeSplit = langRouteName.split('.');
	var routeLang = routeSplit.shift();
	return routeLang;
}
