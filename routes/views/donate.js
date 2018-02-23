var keystone = require('keystone');
var Donation = keystone.list('DonationOptions');
var SupporterIndividual = keystone.list('SupporterIndividual');
var paymentProcessor = require('../../lib/paypalPaymentProcessor');

exports = module.exports = function(req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;

  // Set locals
  locals.hideDonate = true;
  locals.donationAmount = Donation.fields.donationAmount.ops;
  locals.formData = req.body || {};
  locals.validationErrors = {};
  locals.donationReceived = false;

  view.query('donateOptions', keystone.list('DonationOptions').model.find());
  
  /*
     On POST request: User has clicked donate
  
    - Create Paypal payment, get paymentId
    - Add Donation item to the database, with paymentId as key
    - Redirect to Paypal auth screen
  */
  view.on('post', { action: 'pay' }, function(next) {

    const donationAmount = parseInt(req.body.donationAmount);
    const donatorName = req.body.name;
    console.log(`processing payment for donation of: ${donationAmount} from: ${donatorName}`);
    
    paymentProcessor.createPayment(
      donationAmount,
      function success(paymentId, redirectUrl) {
        var newSupporter = new SupporterIndividual.model({
          key: paymentId,
        });
        var updater = newSupporter.getUpdateHandler(req);
        updater.process(
          req.body,
          {
            flashErrors: true,
            fields: 'name, email, donationAmount',
            errorMessage: 'There was a problem submitting your enquiry:',
          },
          function(err) {
            if (err) {
              locals.validationErrors = err.errors;
              next();
            } else {
              // redirect to Paypal to approve payment
              res.redirect(redirectUrl);
            }
          }
        );

      },
      function error() {
        req.flash(
          'error',
          'An internal error occured. Please contact the system administrator to verify your payment'
        );
        next();
      }
    );
  });

  /*
    Paypal has redirected back to us and we need to handle either:
     - success meaning the user has made a payment and we are to execute it
     - cancel meaning the user has cancelled
  */
  view.on('get', function(next) {
    
    if (req.query.outcome == 'success') {
      
      const payerId = req.query.PayerID;
      const paymentId = req.query.paymentId;

      keystone
        .list('SupporterIndividual')
        .model.findOne({ key: paymentId })
        .exec(function(err, user) {
          if (user) {
            console.log('user found: ' + user.name + ' donation amount: ' + user.donationAmount);
            
            // finalize payment on paypal
            paymentProcessor.executePayment(
              payerId,
              paymentId,
              user.donationAmount,
              function success(payment) {
                user.paymentCompleted = 'true';
                //TODO: add payerId to model 
                user.save(function(err) {
                  console.log('donator updated...');
                  req.flash('success', 'Payment complete. Thank you for your donation!');
                  next();
                });
              },
              function error(errorMessage) {
                req.flash(
                  'warning',
                  'An internal error occured. Please contact the system administrator to verify your payment'
                );
                next();
              }
            );

          } else {
            req.flash(
              'error',
              'An internal error occured. Please contact the system administrator to verify your payment'
            );
            next();
          }
        });
    } else if (req.query.outcome == 'cancel') {
      req.flash(
        'warning',
        'Your payment has been cancelled. You have not been charged.'
      );
      next();
    } else {
      next();
    }
  });


  view.render('donate');
};
