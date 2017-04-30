var keystone = require('keystone');
var notifications = require('../lib/notifications');

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
  Subscriber.model
    .findById(this._id)
    .populate('preferredLanguage')
    .exec((err, subscriber) => {
      if (err) {
        throw new Error(err);
      }
      notifications.sendSubscriptionNotification(subscriber, callback);
    })
};

Subscriber.defaultSort = '-createdAt';
Subscriber.defaultColumns = 'name, email, preferredLanguage, createdAt';
Subscriber.register();
