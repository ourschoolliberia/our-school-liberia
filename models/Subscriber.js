var keystone = require('keystone');
var Email = require('keystone-email');
var Types = keystone.Field.Types;

/**
 * Subscriber Model
 * =============
 */

var Subscriber = new keystone.List('Subscriber', {
	nocreate: true,
	noedit: true,
});

var dateParseFormat = 'DD/MM/YYYY';

Subscriber.add({
	name: { type: Types.Name, required: true },
	email: { type: Types.Email, required: true },
	preferredLanguage: { type: Types.Relationship, ref: 'Language' },
	createdAt: { type: Date, default: Date.now },
});

Subscriber.schema.pre('save', function(next) {
	this.wasNew = this.isNew;
	next();
});

Subscriber.schema.post('save', function() {
	if (this.wasNew) {
		this.sendNotificationEmail();
	}
});

Subscriber.schema.methods.sendNotificationEmail = function(callback) {

	if ('function' !== typeof callback) {
		callback = function(err) {
			if (err) {
				console.log(err);
			}
		};
	}

	var subscriber = this;
	var emailer = new Email('subscription-list', {
		transport: 'mailgun',
		engine: 'pug',
		root: 'templates/emails',
		apiKey: process.env.MAILGUN_KEY,
		domain: process.env.MAILGUN_DOMAIN,
	});

	keystone.list('User').model.find().where('isAdmin', true).exec(function(err, admins) {

		if (err) {
			return callback(err);
		} 

		emailer.send({
			subscriber: subscriber
		}, {
			to: admins,
			from: {
				name: 'Our School Liberia',
				email: 'code@dannyshaw.io'
			},
			subject: 'New Subscriber for Our School Liberia',
		}, callback);

	});

};

Subscriber.defaultSort = '-createdAt';
Subscriber.defaultColumns = 'name, email, language, createdAt';
Subscriber.register();
