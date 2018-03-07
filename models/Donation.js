var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Donation Model
 * =============
 */

var Donation = new keystone.List('DonationOptions', {
  label: 'Donation options',
  map: { name: 'title' },
  autokey: { path: 'slug', from: 'title', unique: true },
  sortable: true,
});

Donation.add({
  title: { type: String, required: true, default: 'Equipment', initial: true },
  donationAmount: {
    type: Types.Select,
    options: [5, 10, 20, 50, 100, 300, 500, 1000],
  },
  image: { type: Types.CloudinaryImage },
  message: { type: Types.Textarea, height: 150 },
  createdAt: { type: Date, default: Date.now },
});

// Donation.schema.pre('save', function(next) {
//   this.wasNew = this.isNew;
//   next();
// });

// Donation.schema.post('save', function() {
//   if (this.wasNew) {
//     this.sendNotificationEmail();
//   }
// });

// Donation.schema.methods.sendNotificationEmail = function(callback) {
//   if ('function' !== typeof callback) {
//     callback = function() {};
//   }

//   var donation = this;

//   keystone
//     .list('User')
//     .model.find()
//     .where('isAdmin', true)
//     .exec(function(err, admins) {
//       if (err) return callback(err);

//       new keystone.Email('donation-notification').send(
//         {
//           to: admins,
//           from: {
//             name: 'Our School Liberia',
//             email: 'contact@our-school-liberia.com',
//           },
//           subject: 'New Donation for Our School Liberia',
//           donation: donation,
//         },
//         callback
//       );
//     });
// };

Donation.defaultSort = '-createdAt';
Donation.defaultColumns = 'title, donationAmount|20%, image|20%';
Donation.register();
