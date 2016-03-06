var keystone = require('keystone');
var langRouter = require('../langRouter');

exports = module.exports = function(req, res) {
	
	debugger;

	var locals = res.locals;
	
	// Set locals
	locals.section = 'posts';
	locals.language = req.i18n.getLocale();
	locals.filters = {
		post: req.params.post
	};
	locals.data = {
		posts: []
	};
	


	// function doView() {
// console.log('WHAT THE FUX0R');
	var view = new keystone.View(req, res);
		
	// // Load the current post
	view.on('init', function(next) {
			
		var q = keystone.list('Update').model.findOne({
			state: 'published',
			slug: locals.filters.post
		}).populate('author categories language translation');
		
		q.exec(function(err, result) {
			locals.data.post = result;
			next();
			// doView();
		});

			
	});
		
	view.on('init', function (next) { 
		//if the post loaded is from another language
		//fetch the translation for the current language
		//TODO: Currently it's 1:1 but could be many to one quite easily
		if(locals.language !== locals.data.post.language.languageKey) {
			
			if(locals.data.post.translation) {
				req.params.post = locals.data.post.translation.slug;
				debugger;
				console.log("Breaking");
				langRouter.redirectToLocalisedRoute(req, res, next);
				return;
			}
		}
		next();
	});

	// Load other posts
	view.on('init', function(next) {
		
		var q = keystone.list('Update').model.find().where('state', 'published').sort('-publishedDate').populate('author').limit('4');
		
		q.exec(function(err, results) {
			locals.data.posts = results;
			next(err);
		});
		
	});
	
	// Render the view
	view.render('post');
// }	
	
};
