var keystone = require('keystone');
var async = require('async');
var Types = keystone.Field.Types;

/**
 * Update Model
 * ==========
 */

var Update = new keystone.List('Update', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true }
});

Update.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	language: { type: Types.Relationship, ref: 'Language', index: true, initial: 'en' },
	
	translation: {type: Types.Relationship, ref: 'Update' },
	
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	image: { type: Types.CloudinaryImage },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 }
	},
	categories: { type: Types.Relationship, ref: 'Category', many: true },
	gallery: { type: Types.Relationship, ref: 'Gallery'},
});

Update.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
});


//remove all translation relationships to this post
Update.schema.post('save', function (doc) {

	keystone.list('Update').model.find({'translation': doc}).exec(function(err, result) {
		console.log('translations', result)
		async.each(result, function(post, done) {
			
			//only remove if necessary
			if(!post._id.equals(doc.translation)) {
				post.set('translation', null);
				post.save();				
			}
			done();
		}, function (err) {
			console.log('done removing backrefs', err);
		});
	});
})

//link the relationship to the translation if set
Update.schema.post('save', function (doc) {

	if (!doc.translation)
		return;

	keystone.list('Update').model.findOne(doc.translation).exec(function(err, post) {
		//only add reference/save if not set correctly
		if(!post.translation || !post.translation.equals(doc.id)) {
			post.set('translation', doc);
			post.save();			
		}
	}, function (err) {
		console.log('done creating backref', err);
	});
});




Update.defaultColumns = 'title, state|10%, author|20%, translation|20%, publishedDate|20%';
Update.register();
