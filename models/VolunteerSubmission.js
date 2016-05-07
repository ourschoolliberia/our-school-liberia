var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * VolunteerSubmission Model
 * =============
 */

var VolunteerSubmission = new keystone.List('VolunteerSubmission', {
	nocreate: true,
	noedit: true
});

VolunteerSubmission.add({
	name: { type: Types.Name, required: true },
	email: { type: Types.Email, required: true },
	dob: { type: Types.Date, required: true },
	proposedStartDate: { type: Types.Date, required: true },
	proposedEndDate: { type: Types.Date, required: true },
	email: { type: Types.Email, required: true },
	areasOfInterest: { type: String, required: true },
	qualifications: { type: String },
	teacherQualifications: { type: Types.Textarea },
	more: { type: Types.Textarea },
	createdAt: { type: Date, default: Date.now }
});

VolunteerSubmission.schema.pre('save', function(next) {
	this.wasNew = this.isNew;
	next();
});

VolunteerSubmission.schema.post('save', function() {
	if (this.wasNew) {
		this.sendNotificationEmail();
	}
});

VolunteerSubmission.schema.methods.sendNotificationEmail = function(callback) {
	
	if ('function' !== typeof callback) {
		callback = function() {};
	}
	
	var enquiry = this;
	
	keystone.list('User').model.find().where('isAdmin', true).exec(function(err, admins) {
		
		if (err) return callback(err);
		
		new keystone.Email('volunteer-notification').send({
			to: admins,
			from: {
				name: 'Our School Liberia',
				email: 'github@dannyshaw.io'
			},
			subject: 'New Volunteer Submission for Our School Liberia',
			enquiry: enquiry
		}, callback);
		
	});
	
};

VolunteerSubmission.defaultSort = '-createdAt';
VolunteerSubmission.defaultColumns = 'name, email, enquiryType, createdAt';
VolunteerSubmission.register();
