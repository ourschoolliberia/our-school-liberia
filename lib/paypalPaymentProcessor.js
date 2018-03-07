var paypal = require('paypal-rest-sdk');

paypal.configure({
  mode: 'sandbox', //sandbox or live
  // "host" : "api.sandbox.paypal.com",
  // "port" : "",
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET,
});

  // start paypal payment
const getCreatePaymentJSON = (amount) => ({
  intent: 'sale',
  payer: {
    payment_method: 'paypal',
  },
  redirect_urls: {
    return_url: process.env.SITE_URL + '/donate?outcome=success',
    cancel_url: process.env.SITE_URL + '/donate?outcome=cancel',
  },
  transactions: [
    {
      item_list: {
        items: [
          {
            name: 'Individual Donation',
            sku: '001',
            price: amount,
            currency: 'USD',
            quantity: 1,
          },
        ],
      },
      amount: {
        currency: 'USD',
        total: amount,
      },
      description: 'Donation to LREC Duazon, Liberia',
    },
  ],
});

const getExecutePaymentJSON = (payerId, amount) => ({
  payer_id: payerId,
  transactions: [
    {
      amount: {
        currency: 'USD',
        total: amount,
      },
    },
  ],
});


const createPayment = (amount, successCallback, errorCallback) => {
  const paymentJSON = getCreatePaymentJSON(amount);
  paypal.payment.create(paymentJSON, function(error, payment) {
    if (error) {
      console.log('payment creation error ::: ', error);
      console.log('paymentJSON ::: ', paymentJSON);
      errorCallback(error)
    } else {
      // looking for an approval_url link
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === 'approval_url') {
          const redirectLink = payment.links[i].href;
          successCallback(payment.id, redirectLink)
        }
      }
    }
  })
};

const executePayment = (payerId, paymentId, amount, successCallback, errorCallback) => {
  const paymentJSON = getExecutePaymentJSON(payerId, amount);
  paypal.payment.execute(paymentId, paymentJSON, function(error, payment) {
    if (error) {
      console.log('payment execution error', error.response);
      errorCallback(error.response)
    } else {
      successCallback(payment);
    }
  });
};

module.exports = {
  createPayment: createPayment,
  executePayment: executePayment,
};
