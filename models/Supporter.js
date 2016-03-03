var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Supporter Model
 * ===============
 */

var Supporter = new keystone.List('Supporter', {
	map: { name: 'name' },
	autokey: { path: 'slug', from: 'name', unique: true }
});

Supporter.add({
	type: { type: Types.Select, options: 'company, individual', index: true, initial: true },
	
	//indvidual fields
	name: { type: Types.Name, required: true, dependsOn: { type: 'individual' }, initial: false },
	
	//company fields
	companyName: { type: String, required: false, dependsOn: { type: 'company' }, initial: false },
	logo: { type: Types.CloudinaryImage, required: false, dependsOn: { type: 'company'} },
	url:  { type: Types.Url, required: false, dependsOn: { type: 'company'} },
});

Supporter.defaultColumns = 'type, name, companyName, url, logo';
Supporter.register();
