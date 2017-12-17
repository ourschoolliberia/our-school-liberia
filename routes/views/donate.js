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
    "client_id" : "ATa2OklO_gXCaV_RwJ_NpKlSOkegl2gG9JWAIJdj17NUBe9H5v8JZ7ZQRb00SYdT17VBbdXy9J_pV5Bf",  // your paypal application client id
    "client_secret" : "EOk-VLq_nhGCsKILSiDLkGEVOvEz4Y4yDQiX1T7eYQXhg0kGOq85Ywmi2SjA6ak4M89x2TLQTx2vWUQS" // your paypal application secret id
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
  view.on('get', { action: 'success' }, function(next) {
    console.log('payment successfull');
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
      "payer_id": payerId,
      "transactions": [{
          "amount": {
              "currency": "USD",
              "total": parseInt(req.body.donationAmount) // "25.00"
          }
      }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      if (error) {
          console.log(error.response);
          throw error;
      } else {
          console.log(JSON.stringify(payment));
          res.send('Success');
      }
  });
  });

// If payment not successfull
  view.on('get', { action: 'cancel' }, function(next){
    console.log('payment unsuccessfull');
    res.send('Cancelled');
  });


	// On POST requests, add the Donation item to the database
	view.on('post', { action: 'donate' }, function(next) {

		// start paypal payment
		var payment_json = {
      "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://localhost:3000/donate/success",
        "cancel_url": "http://localhost:3000/donate/cancel"
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
        "description": "Donation to LREC Duazon Liberia"
      }]
		};

    paypal.payment.create(payment_json, function (error, payment) {
    if (error) {
        console.log('payment ::: error');
        throw error;
    } else {
        for(let i = 0;i < payment.links.length;i++){
          if(payment.links[i].rel === 'approval_url'){
            console.log('payment ::: redirectUrl: '+payment.links[i].href);
            res.redirect(payment.links[i].href);
          }
        }
    }
  });

		// paypal.payment.create(payment, function (error, payment) {
		// if (error) {
		//  console.log(error);
		// } else {
		//  if(payment.payer.payment_method === 'paypal') {
		// 	 console.log("payment id: "+payment.id);
		// 	 req.paymentId = payment.id;
		// 	 var redirectUrl;
		// 	 console.log(payment);
		// 	 for(var i=0; i < payment.links.length; i++) {
		// 		 var link = payment.links[i];
		// 		 if (link.method === 'REDIRECT') {
		// 			 redirectUrl = link.href;
		// 		 }
		// 	 }
		// 	 res.redirect(redirectUrl);
		//  }
		// }
		// });

		//end payment

    // register supporter in DB
		var newSupporter = new SupporterIndividual.model(),
			updater = newSupporter.getUpdateHandler(req);

      console.log('payment :: new supporter is being added');

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

	});

	view.render('donate');
};
