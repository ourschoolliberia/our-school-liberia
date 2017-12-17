var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * SupporterIndividual Model
 * =========================
 */

var SupporterIndividual = new keystone.List('SupporterIndividual', {
	map: { name: 'name' },
	autokey: { path: 'slug', from: 'name', unique: true },
	sortable: true
});

var dateParseFormat = 'DD/MM/YYYY';

SupporterIndividual.add({
	name: { type: String, required: true },
	email: { type: Types.Email },
	image: { type: Types.CloudinaryImage },
	message: { type: Types.Markdown},
	donationAmount: {type:Number},
	donatedOn: { type: Date },
	published: {type: Boolean}
	});

SupporterIndividual.defaultColumns = 'name, email, donationAmount, published';
SupporterIndividual.register();
