var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * WishListItem Model
 * ==========
 */

var WishListItem = new keystone.List('WishListItem', {
  map: { name: 'name' },
  sortable: true,
});

WishListItem.add({
  title: { type: String, initial: true },
  description: { type: Types.Textarea, height: 150 },
});

WishListItem.defaultColumns = 'title, description, language, translation';
WishListItem.register();
