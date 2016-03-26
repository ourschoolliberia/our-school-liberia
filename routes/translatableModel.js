var keystone = require('keystone');
var async = require('async');
var Types = keystone.Field.Types;

module.exports = function(model) {

	// debugger;

	model.add({
		translation: {type: Types.Relationship, ref: model.key },
	})

	//remove all translation relationships to this post
	model.schema.post('save', function (doc) {

		keystone.list(model.key).model.find({'translation': doc}).exec(function(err, result) {
			console.log('translations', result)
			async.each(result, function(translationDoc, done) {
				
				//only remove if necessary
				if(!translationDoc._id.equals(doc.translation)) {
					translationDoc.set('translation', null);
					translationDoc.save();				
				}
				done();
			}, function (err) {
				console.log('done removing backrefs', err);
			});
		});
	})

	//link the relationship to the translation if set
	model.schema.post('save', function (doc) {

		if (!doc.translation)
			return;

		keystone.list(model.key).model.findOne(doc.translation).exec(function(err, translationDoc) {
			//only add reference/save if not set correctly
			if(!translationDoc.translation || !translationDoc.translation.equals(doc.id)) {
				translationDoc.set('translation', doc);
				translationDoc.save();			
			}
		}, function (err) {
			console.log('done creating backref', err);
		});
	});

	return model;

}
