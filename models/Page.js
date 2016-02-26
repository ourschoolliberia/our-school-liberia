var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Page Model
 * ==========
 */

var Page = new keystone.List('Page', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true }
});

Page.add({
	title: { type: String, required: true },
	language: { type: Types.Relationship, ref: 'Langauge', many: false },
	image: { type: Types.CloudinaryImage },
	content: { type: Types.Html, wysiwyg: true, height: 150 },
});

Page.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
});

Page.defaultColumns = 'title, language|20%';
Page.register();
