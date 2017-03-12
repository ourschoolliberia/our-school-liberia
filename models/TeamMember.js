var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * TeamMember Model
 * ==========
 */

var TeamMember = new keystone.List('TeamMember', {
	map: { name: 'name' },
	autokey: { path: 'slug', from: 'name', unique: true },
	sortable: true
});

TeamMember.add({
	name: { type: Types.Name, required: true, default: '', initial: true },
	type: { type: Types.Select, options: 'staff', default: 'staff', index: true, initial: false },
	role: { type: String, intital: true },
	image: { type: Types.CloudinaryImage },
	bio: { type: Types.Textarea, height: 150 },
});

TeamMember.defaultColumns = 'name, type|20%, role|20%, image|20%';
TeamMember.register();
