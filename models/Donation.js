var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Donation Model
 * =============
 */

var Donation = new keystone.List('Donation', {
  nocreate: true,
  noedit: true,
});

Donation.add({
  name: { type: Types.Name, required: true },
  email: { type: Types.Email, required: true },
  phone: { type: String },
  donationAmount: {
    type: Types.Select,
    options: [5, 10, 15, 20, 25, 30, 100000000],
  },
  message: { type: Types.Markdown, required: true },
  createdAt: { type: Date, default: Date.now },
});

Donation.schema.pre('save', function(next) {
  this.wasNew = this.isNew;
  next();
});

Donation.schema.post('save', function() {
  if (this.wasNew) {
    this.sendNotificationEmail();
  }
});

Donation.schema.methods.sendNotificationEmail = function(callback) {
  if ('function' !== typeof callback) {
    callback = function() {};
  }

  var donation = this;

  keystone
    .list('User')
    .model.find()
    .where('isAdmin', true)
    .exec(function(err, admins) {
      if (err) return callback(err);

      new keystone.Email('donation-notification').send(
        {
          to: admins,
          from: {
            name: 'Our School Liberia',
            email: 'contact@our-school-liberia.com',
          },
          subject: 'New Donation for Our School Liberia',
          donation: donation,
        },
        callback
      );
    });
};

Donation.defaultSort = '-createdAt';
Donation.defaultColumns = 'name, email, donationAmount, createdAt';
Donation.register();
