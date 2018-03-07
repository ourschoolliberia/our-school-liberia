var keystone = require('keystone');

exports = module.exports = function(req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;

  // Set locals
  locals.filters = {
    post: req.params.post,
  };
  locals.data = {
    posts: [],
  };

  // // Load the current post
  view.on('init', function(next) {
    var q = keystone
      .list('Update')
      .model.findOne({
        state: 'published',
        slug: locals.filters.post,
      })
      .populate('author categories language translation gallery');

    q.exec(function(err, result) {
      locals.data.post = result;
      next();
    });
  });

  // if the post loaded is in another language, fetch the translation
  // for the current language
  //
  // TODO:Currently it's 1:1 but could be many to one quite easily
  //		and just pick the one that matches the current language
  view.on('init', function(next) {
    if (locals.data.post.language.key !== req.i18n.getLocale()) {
      if (locals.data.post.translation) {
        req.params.post = locals.data.post.translation.slug;
        res.languageRedirect(req, res, next);
        return;
      } else {
        //warn no translation available
        const notAvailable = req.i18n.__('messages.news-update-not-available');
        req.flash('info', notAvailable);
      }
    }
    next();
  });

  // Load other posts
  view.on('init', function(next) {
    var q = keystone
      .list('Update')
      .model.find()
      .where('state', 'published')
      .sort('-publishedDate')
      .populate('author')
      .limit(4);
    console.log('loading other posts');
    q.exec(function(err, results) {
      locals.data.posts = results;
      next();
    });
  });

  // Render the view
  view.render('post');
};
