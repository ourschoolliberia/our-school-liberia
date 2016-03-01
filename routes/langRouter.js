var _ = require('underscore');
var invariant = require('invariant');


var langRouteMap = require('./langRouteMap');

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
						// createStaticRoute(app, lang, langRouteName, langPage.route, page.templatePrefix)
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
	if(res.locals.langaugeSwitch) {
		var newLang = req.i18n.getLocale();
		var oldLang = res.locals.oldLanguage;
		var currentRouteName = req.route.name;
		var redirectUrl;

		var routeName = findRouteNameForLang(oldLang, newLang, currentRouteName);
		
		if(routeName) {
			var redirectUrl = req.app.namedRoutes.build(routeName, req.params)
			
			console.log('redirecting from ' + currentRouteName + ' to ' + routeName);
			res.redirect(redirectUrl);
			return;
		}
	}
	next();
}


function createDynamicRoute(app, routeName, routePath, controller) {
	console.log('creating route for ' + routeName); 
	app.get(routePath, routeName, languageRouteRedirect, controller);
}


function findRouteNameForLang (oldLang, newLang, langRouteName) {
	//this basically just switches the 
	var routeSplit = langRouteName.split('.');
	var routeLang = routeSplit.shift();
	routeSplit.unshift(newLang)
	var redirectRouteName = routeSplit.join('.');
	return redirectRouteName;
}

// function createStaticRoute(app, lang, routeName, routePath, templatePrefix) {
// 	var langRouteName = lang + '.' + routeName;

// 	app.get(routePath, langRouteName, function (req, res) {
		
// 		var view = new keystone.View(req, res);
// 		var locals = res.locals;
		
// 		// locals.section is used to set the currently selected
// 		// item in the header navigation.
// 		locals.section = route.parent || route.key;
// 		locals.currentPage = route.key;
		
// 		// Render the view, view is named as the key
// 		view.render(route.key);
// 	});
// }
