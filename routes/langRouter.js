var _ = require('underscore');
var invariant = require('invariant');
var keystone = require('keystone');
var middleware = require('./middleware');
var langRouteMap = require('./langRouteMap');


exports.initLanguage = function(req, res, next) {
	var oldLanguage, siteLanguage;
	var setLanguage = false;
	req.i18n.setLocaleFromCookie();
	oldLanguage = siteLanguage = req.i18n.getLocale();
	
	console.log("we're in: ", siteLanguage);
	if(req.query.setlanguage) {
		siteLanguage = req.query.setlanguage;

		if(oldLanguage != siteLanguage) {
			setLanguage = true;
			res.locals.langaugeSwitch = true;
			console.log('OLD: ', oldLanguage);
			res.locals.oldLanguage = oldLanguage;
		}
	} 

	if(setLanguage) {
		req.i18n.setLocale(siteLanguage);
		res.cookie('lang', siteLanguage, { maxAge: 900000, httpOnly: true });
	}

	res.locals.siteLanguage = siteLanguage;

	next();
}


exports.generateRoutes = function (app) {
	var languages = ['en', 'de'];

	_(langRouteMap).each(function (page, routeName) {
		console.log(routeName);
		
		if(page.languages) {

			_(languages).each(function (lang) { 
				var langPage = page.languages[lang];
				var langRouteName = lang + '.' + routeName;
				
				if (!langPage)
					return;

				if(langPage.route) {
					if (page.controller) {
						createDynamicRoute(app, langRouteName, langPage.route, page.controller);
					} else {
						invariant(page.templatePrefix, "If no controller is passed then a template prefix is expected");
					var template = page.templatePrefix + '-' + lang;
						createStaticRoute(app, langRouteName, langPage.route, template, page.section)
					}
				} else {
					throw "No route found";
				}
				console.log(langPage.route);
			});
		}

	});
};

function languageRouteRedirect(req, res, next) {
	var currentLang = req.i18n.getLocale();
	
	if(res.locals.langaugeSwitch) {
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
		//lastly, if the route browsed to is from another language 
		//lets insist we're in that language
		//(but only if the query string to change isnt set...)
		var routeLang = getLangFromRouteName(req.route.name)
		if(routeLang && routeLang !== currentLang) {
			req.i18n.setLocale(routeLang);
			res.locals.siteLanguage = routeLang;
			res.cookie('lang', routeLang, { maxAge: 900000, httpOnly: true });
			
			//HACK: redo the nav last minute
			middleware.initNav(req, res, function(){/*noop*/});
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
