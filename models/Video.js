var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Video Model
 * ===========
 */

var Video = new keystone.List('Video', {
  // map: {
  // 	name: 'details.title'
  // },
  autokey: { path: 'slug', from: 'details.title', unique: true },
});

Video.add({
  source: { type: Types.Url, required: true, initial: true },
  details: { type: Types.Embedly, from: 'source' },
  // title: { type: String },
});

Video.defaultColumns = 'details.title, details.description, source';
Video.register();
