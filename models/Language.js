var keystone = require('keystone');

/**
 * Language Model
 * ==================
 */

var Language = new keystone.List('Language', {
	autokey: { from: 'name', path: 'key', unique: true }
});

Language.add({
	languageKey: { type: String, required: true, unique: true, initial: false },
	name: { type: String, required: true, initial: false }
});

Language.defaultColumns = 'name, languageKey|20%';

// Language.relationship({ ref: 'Post', path: 'language' });
// Language.relationship({ ref: 'Page', path: 'language' });

Language.register();
