var keystone = require('keystone');
var Donation = keystone.list('Donation');

exports = module.exports = function(req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;

  // Set locals
  locals.hideDonate = true;
  locals.donationAmount = Donation.fields.donationAmount.ops;
  locals.formData = req.body || {};
  locals.validationErrors = {};
  locals.donationReceived = false;

  // On POST requests, add the Donation item to the database
  view.on('post', { action: 'donate' }, function(next) {
    var newDonation = new Donation.model(),
      updater = newDonation.getUpdateHandler(req);

    updater.process(
      req.body,
      {
        flashErrors: true,
        fields: 'name, email, phone, donationAmount, message',
        errorMessage: 'There was a problem submitting your enquiry:',
      },
      function(err) {
        if (err) {
          locals.validationErrors = err.errors;
        } else {
          locals.donationReceived = true;
        }
        next();
      }
    );
  });

  view.render('donate');
};
