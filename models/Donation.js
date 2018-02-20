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
	sortable: true
});

Donation.add({
	title: { type: String, required: true, default: 'Equipment', initial: true},
	donationAmount: { type: Types.Select, options: [
		5, 10, 20, 50, 100, 300, 500, 1000
	] },
	image: { type: Types.CloudinaryImage },
	message: { type: Types.Textarea, height: 150 },
	// createdAt: { type: Date, default: Date.now }
});

Donation.defaultColumns = 'title, donationAmount|20%, image|20%';
Donation.register();
