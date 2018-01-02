var keystone = require('keystone');
var Donation = keystone.list('Donation');
var SupporterIndividual= keystone.list('SupporterIndividual');

// paypal configuration set to test interface created by Andreas
var paypal = require('paypal-rest-sdk');
var config = {
  "port" : 5000,
  "api" : {
		"mode": "sandbox", //sandbox or live
    // "host" : "api.sandbox.paypal.com",
    // "port" : "",
    "client_id" : "ATa2OklO_gXCaV_RwJ_NpKlSOkegl2gG9JWAIJdj17NUBe9H5v8JZ7ZQRb00SYdT17VBbdXy9J_pV5Bf",  // dev (meyer) paypal application client id
    "client_secret" : "EOk-VLq_nhGCsKILSiDLkGEVOvEz4Y4yDQiX1T7eYQXhg0kGOq85Ywmi2SjA6ak4M89x2TLQTx2vWUQS" // dev (meyer) paypal application secret id
// Test accounts used for testing paypal payment:
// donator@our-school-liberia.com pw: 12345678
// business@our-school-liberia.com pw: 12345678
// see sandbox.paypal.com (login)
//
  }
}
paypal.configure(config.api);

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.hideDonate = true;
	locals.donationAmount = Donation.fields.donationAmount.ops;
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.donationReceived = false;

	view.query(
		'donateOptions',
		keystone.list('Donation').model.find()
	);

  // if payment successfull
	view.on('init', function (next) {

	// 	var q = Post.model.findOne({
	// 		state: 'published',
	// 		key: locals.filters.post,
	// 	}).populate('author categories');
  //
	// 	q.exec(function (err, result) {
	// 		locals.post = result;
	// 		next(err);
	// 	});
  //
	// });

    // var match = req.url.match(/(success|cancel)/);

    if (req.query.outcome=='success') {   // old: match && match[1]==
      const payerId = req.query.PayerID;
      const paymentId = req.query.paymentId;

      keystone.list('SupporterIndividual').model.findOne({ key : req.query.paymentId }).exec(function (err, user) {
        if (user) {
          console.log('user found: '+user.name+' donation amount: '+user.donationAmount);
          // finalize payment on paypal
          const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": user.donationAmount // parseInt(req.body.donationAmount) // "25.00"
                }
            }]
          };
          paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
            if (error) {
              req.flash('warning', 'An internal error occured. Please contact the system administrator to verify your payment');
              console.log(error.response);
              // throw error;
              next();
            } else {
                // console.log(JSON.stringify(payment));

                // update supporter individual
                  user.paymentCompleted='true';
                  user.save(function(err) {
                    // console.log('donator updated...');
                    req.flash('success', 'Payment complete. Thank you for your donation!');
                    next();
                  });
              }
            });
          }else{
            req.flash('warning', 'An internal error occured. Please contact the system administrator to verify your payment');
            next();
          }
          });


  } else if (req.query.outcome=='cancel'){
      req.flash('warning', 'An internal error occured please contact the system administrator to verify your payment');
      next();
  } else {
    next();
  }
  });


	// On POST requests, add the Donation item to the database
	view.on('post', { action: 'pay' }, function(next) {

  console.log('processing payment for donation of: '+parseInt(req.body.donationAmount)+' from: '+req.body.name);
		// start paypal payment
		var payment_json = {
      "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://localhost:3000/donate?outcome=success",
        "cancel_url": "http://localhost:3000/donate?outcome=cancel"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "Test donation",
                "sku": "001",
                "price": parseInt(req.body.donationAmount), // "25.00",
                "currency": "USD",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "USD",
            "total": parseInt(req.body.donationAmount) // "25.00"
        },
        "description": "Donation to LREC Duazon, Liberia"
      }]
		};

    paypal.payment.create(payment_json, function (error, payment) {
    if (error) {
        console.log('payment ::: error');
        req.flash('warning', 'An internal error occured. Please contact the system administrator to verify your payment');
        next();
        // throw error;
    } else {
        for(let i = 0;i < payment.links.length;i++){
          if(payment.links[i].rel === 'approval_url'){

            // register supporter in DB
            var newSupporter = new SupporterIndividual.model({
              key: payment.id,
            });
              updater = newSupporter.getUpdateHandler(req);

            updater.process(req.body, {
              flashErrors: true,
              fields: 'name, email, donationAmount',
              errorMessage: 'There was a problem submitting your enquiry:'


            }, function(err) {
              if (err) {
                locals.validationErrors = err.errors;
              } else {
                locals.donationReceived = true;
              }
              // next(); // Mea: next also removed from params.
            });

            // redirect to Paypal
            res.redirect(payment.links[i].href);
          }
        }
    }
  });


	});

	view.render('donate');
};
