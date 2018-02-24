var keystone = require('keystone');
var Email = require('keystone-email');

function getEmailer(template) {
  return new Email(template, {
    transport: 'mailgun',
    engine: 'pug',
    root: 'templates/emails',
    apiKey: process.env.MAILGUN_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  });
}

function getSubmissionRecepients() {
  return new Promise(function (resolve, reject) {
    keystone.list('User').model
      .find()
      .where('isAdmin', true)
      .exec(function(err, admins) {
        if (err) {
          reject(err);
        } else {
          resolve(admins);
        }
      })
    ;
  });
}


function sendSubscriptionNotification(subscriber, callback) {

  if ('function' !== typeof callback) {
    callback = function(err) {
      if (err) {
        console.log(err);
      }
    };
  }
  var emailer = getEmailer('subscription-list');
  var locals = {
    subscriber: subscriber,
    siteUrl: process.env.SITE_URL,
  };

  getSubmissionRecepients()
    .then(admins => {
      emailer.send(locals, {
        to: admins,

        from: {
          name: 'Our School Liberia',
          email: 'code@dannyshaw.io'
        },
        subject: 'New Subscriber for Our School Liberia',
      }, callback);
    })
    .catch(callback)
  ;  
}

function sendVolunteerSubmissionNotification(submission, callback) {
    if ('function' !== typeof callback) {
      callback = function() {};
    }

    var emailer = getEmailer('volunteer-submission');
    var locals = {
      submission: submission
    };


    getSubmissionRecepients()
      .then(admins => {
        console.log(admins);
        emailer.send({
          to: admins,
          from: {
            name: 'Our School Liberia',
            email: 'code@dannyshaw.io'
          },
          subject: 'New Volunteer Submission for Our School Liberia',
          submission: submission
        }, callback);
      })
      .catch(callback)
    ;
  }



module.exports = {
  sendSubscriptionNotification: sendSubscriptionNotification,
  sendVolunteerSubmissionNotification: sendVolunteerSubmissionNotification,
};
