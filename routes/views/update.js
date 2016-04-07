var keystone = require('keystone');
var localeRouter = require('keystone-locale').Router;

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// Set locals
	locals.section = 'posts';
	locals.filters = {
		post: req.params.post
	};
	locals.data = {
		posts: []
	};
	
		
	// // Load the current post
	view.on('init', function(next) {
			
		var q = keystone.list('Update').model.findOne({
			state: 'published',
			slug: locals.filters.post
		}).populate('author categories locale translation');
		
		q.exec(function(err, result) {
			locals.data.post = result;
			next();
		});
	});


	// if the post loaded is in another locale, fetch the translation 
	// for the current locale
	// 
	// TODO:Currently it's 1:1 but could be many to one quite easily 
	//		and just pick the one that matches the current locale
	view.on('init', function (next) { 
		if(locals.data.post.locale.key !== req.i18n.getLocale()) {
			if(locals.data.post.translation) {
				req.params.post = locals.data.post.translation.slug;
				res.localeRedirect(req, res, next);
				return;
			} else {
				//no translation
				req.flash('info', req.i18n.__('messages.news-update-not-available'));
			}
		}

		next();
	});

	// Load other posts
	view.on('init', function(next) {
		
		var q = keystone.list('Update').model.find().where('state', 'published').sort('-publishedDate').populate('author').limit('4');
		console.log('loding other posts');
		q.exec(function(err, results) {
			locals.data.posts = results;
			next(err);
		});
		
	});
	
	// Render the view
	view.render('post');
	
};
