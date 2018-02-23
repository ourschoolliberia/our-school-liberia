var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * SupporterIndividual Model
 * =========================
 */

var SupporterIndividual = new keystone.List('SupporterIndividual', {
  map: { name: 'name' },
  autokey: { from: 'name', path: 'slug', unique: true },
  sortable: true,
});

var dateParseFormat = 'DD/MM/YYYY';

SupporterIndividual.add({
  name: { type: Types.Name, required: true },
  key: { type: Types.Key, noedit: true },
  email: { type: Types.Email },
  message: { type: Types.Markdown },
  donationAmount: { type: Number },
  paymentCompleted: { type: Boolean },
  donatedOn: { type: Date },
  published: { type: Boolean },
});
// })
// SupporterIndividual.defaultColumns = 'name';

// Automatically set the date of donation when payment has been processsed
SupporterIndividual.schema.methods.isPaymentCompleted = function() {
  return this.state == true;
};

SupporterIndividual.schema.pre('save', function(next) {
  if (this.isModified('paymentCompleted') && this.isPaymentCompleted() && !this.donatedOn) {
    this.donatedOn = new Date();
  }
  next();
});

SupporterIndividual.defaultColumns = 'name, email, donationAmount, paymentCompleted, published';
SupporterIndividual.register();
