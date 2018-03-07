var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * PressRelease Model
 * =====================
 */

var PressRelease = new keystone.List('PressRelease', {
  map: { name: 'title' },
  autokey: { path: 'slug', from: 'title', unique: true },
  defaultSort: '-dateReleased',
});

PressRelease.add({
  title: { type: String },
  source: { type: Types.Url },
  dateReleased: { type: Types.Date, format: 'dddd DD MMM YY' },
});

PressRelease.defaultColumns = 'title, source, dateReleased';
PressRelease.register();
