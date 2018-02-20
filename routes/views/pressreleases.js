var keystone = require('keystone');

exports = module.exports = function(req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;

  view.query('pressReleases', keystone.list('PressRelease').model.find());

  // Render the view
  view.render('pressreleases');
};
