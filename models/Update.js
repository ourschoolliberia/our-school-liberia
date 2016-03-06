var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Update Model
 * ==========
 */

var Update = new keystone.List('Update', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true }
});

Update.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	language: { type: Types.Relationship, ref: 'Language', index: true, initial: 'en' },
	
	translation: {type: Types.Relationship, ref: 'Update' },
	
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	image: { type: Types.CloudinaryImage },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 }
	},
	categories: { type: Types.Relationship, ref: 'Category', many: true },
	gallery: { type: Types.Relationship, ref: 'Gallery'},
});

Update.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
});

Update.schema.post('save', function (doc) {
	console.log('This will update the linked translation to link back to this Update and remove any previously linked??');T
})

Update.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Update.register();
