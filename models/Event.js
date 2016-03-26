var keystone = require('keystone');
var Types = keystone.Field.Types;
var MultiLingualModel = require('../routes/multiLingualModel');

/**
 * Event Model
 * ==========
 */

var Event = MultiLingualModel(new keystone.List('Event', {
	map: { name: 'name' },
	autokey: { path: 'slug', from: 'name', unique: true },
	defaultSort: '-date'
}));

Event.add({
	name: { type: String, required: true, initial: true },
	date: { type: Types.Datetime },
	language: { type: Types.Relationship, ref: 'Language', many: false },
	location: { type: Types.Location },
	details: { type: Types.Html, wysiwyg: true, height: 150 },
	gallery: { type: Types.Relationship, ref: 'Gallery', many: false }
});

Event.defaultColumns = 'name, date|20%, language|20%';
Event.register();
