var keystone = require('keystone');

exports = module.exports = function(req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;

  //  is used to set the currently selected
  // item in the header navigation.

  // Render the view
  view.render('index');
};
