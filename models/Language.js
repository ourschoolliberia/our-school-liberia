var keystone = require('keystone');

/**
 * Language Model
 * ==================
 */

var Language = new keystone.List('Language', {
	autokey: { from: 'languageKey', path: 'key', unique: true }
});

Language.add({
	name: { type: String, required: true, initial: true },
	languageKey: { type: String, required: true, unique: true, initial: true },
});

Language.defaultColumns = 'name, languageKey|20%, key';

// Language.relationship({ ref: 'Post', path: 'language' });
// Language.relationship({ ref: 'Page', path: 'language' });

Language.register();
