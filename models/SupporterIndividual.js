var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * SupporterIndividual Model
 * =========================
 */

var SupporterIndividual = new keystone.List('SupporterIndividual', {
  map: { name: 'name' },
  autokey: { path: 'slug', from: 'name', unique: true },
});

SupporterIndividual.add({
  name: { type: Types.Name, required: true },
});

SupporterIndividual.defaultColumns = 'name';
SupporterIndividual.register();
