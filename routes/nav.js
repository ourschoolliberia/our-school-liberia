
var i18n = require("i18n-2");
var _ = require('underscore');
var keystone = require('keystone');

exports.initStaticPageRoutes = function (app) {
	getLangMaps(function(langMap, lang) {
		createDynamicRoutes(app, langMap, lang);
		
	})
}


function getLangMaps(doSomethin) {
	var languages = ['en', 'de'];
	var langMaps = {};
	var secondi18n = new i18n({locales: languages});

	//HACK: create another i18n instance to read the sitemap for each 
	// 		lang to create the routes of static pages
	languages.forEach(function(lang) {
		secondi18n.setLocale(lang);
		langMaps[lang] = secondi18n.__('sitemapping');
		if(typeof doSomethin === 'function') {
			doSomethin(langMaps[lang], lang);
		}
	});

	return langMaps;
}



exports.findRedirectForLang = function (currentLang, newLang, currentPath) {
	var langMaps = getLangMaps();
	var objectPath;
	walkNav(langMaps[currentLang], function (node, parent, path) {
		if(currentPath === node.href) {
			objectPath = path;
			return false;
		}
	});

	//return the href from the other language at the same node point
	return objbyString(langMaps[newLang], objectPath.join('.')).href;
};

//helpers
function walkNav(nav, fn) {
	_(nav).each(function(toplevellink, topindex) {
		console.log(toplevellink.key);
		if(fn(toplevellink, null, [topindex]) === false)
			return false

		if(toplevellink.children) {
			_(toplevellink.children).each(function(lowerlevellink, lowerindex) {
				console.log(lowerlevellink.key)
				if(fn(lowerlevellink, toplevellink, [topindex, lowerindex]) === false)
					return false;
			});
		}
	});
}

function createDynamicRoutes (app, tree, lang) {
	var staticRoutes = [];
	walkNav(tree, function (route, parent) {
		if(route.static) {
			console.log('creating static route for ' + route.key + ' at ' + route.href + ' in ' + lang);
			staticRoutes.push({
				path: route.href,
				key: route.key,
				parent: parent.key
			});
		}
	});

	staticRoutes.forEach(function(route) {

		console.log('route', route);
		app.get('/' + lang + route.path, function (req, res) {
			console.log('running view');
			
			var view = new keystone.View(req, res);
			var locals = res.locals;
			
			// locals.section is used to set the currently selected
			// item in the header navigation.
			locals.section = route.parent || route.key;
			locals.currentPage = route.key;
			
			// Render the view, view is named as the key
			view.render(route.key);
		});
	});
}

function objbyString (o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}
