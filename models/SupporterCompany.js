var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * SupporterCompany Model
 * ======================
 */

var SupporterCompany = new keystone.List('SupporterCompany', {
  map: { name: 'companyName' },
  autokey: { path: 'slug', from: 'companyName', unique: true },
});

SupporterCompany.add({
  companyName: { type: String, required: false, initial: true },
  logo: { type: Types.CloudinaryImage, required: false },
  url: { type: Types.Url, required: false },
});

SupporterCompany.defaultColumns = 'companyName, url, logo';
SupporterCompany.register();
