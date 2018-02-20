var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Student Model
 * =============
 */

var Student = new keystone.List('Student', {
  map: { name: 'name' },
  autokey: { path: 'slug', from: 'name', unique: true },
});

Student.add({
  name: { type: Types.Name, required: true },
  image: { type: Types.CloudinaryImage },
  bio: { type: Types.Textarea, height: 50 },
});

Student.defaultColumns = 'name, bio';
Student.register();
