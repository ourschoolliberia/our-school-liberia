var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * SupporterIndividual Model
 * =========================
 */

var SupporterIndividual = new keystone.List('SupporterIndividual', {
	map: { name: 'name' },
	autokey: { from: 'name', path: 'slug', unique: true },
	sortable: true
});

var dateParseFormat = 'DD/MM/YYYY';

SupporterIndividual.add({
	name: { type: String, required: true },
	key: { type: Types.Key },
	email: { type: Types.Email },
	image: { type: Types.CloudinaryImage },
	message: { type: Types.Markdown},
	donationAmount: {type:Number},
	paymentCompleted: { type: Boolean},
	donatedOn: { type: Date },
	published: {type: Boolean}
	});

SupporterIndividual.defaultColumns = 'name, email, donationAmount, paymentCompleted, published';
SupporterIndividual.register();
