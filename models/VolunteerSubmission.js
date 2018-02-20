var keystone = require('keystone');
var notifications = require('../lib/notifications');
var Types = keystone.Field.Types;

/**
 * VolunteerSubmission Model
 * =============
 */

var VolunteerSubmission = new keystone.List('VolunteerSubmission', {
  nocreate: true,
  noedit: true,
});

var dateParseFormat = 'DD/MM/YYYY';

VolunteerSubmission.add({
  name: { type: Types.Name, required: true },
  email: { type: Types.Email, required: true },
  dob: { type: Types.Date, required: true, parseFormat: dateParseFormat },
  proposedStartDate: { type: Types.Date, required: true, parseFormat: dateParseFormat },
  proposedEndDate: { type: Types.Date, required: true, parseFormat: dateParseFormat },
  email: { type: Types.Email, required: true },
  areasOfInterest: { type: String, required: true },
  qualifications: { type: String },
  teacherQualifications: { type: Types.Textarea },
  more: { type: Types.Textarea },
  createdAt: { type: Date, default: Date.now },
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
  var submission = this;
  notifications.sendVolunteerSubmissionNotification(submission, callback);
};

VolunteerSubmission.schema.methods.updateFromRequest = function(req, errorMessage, callback) {
  this.getUpdateHandler(req).process(
    req.body,
    {
      flashErrors: true,
      fields:
        'name, email, dob, proposedStartDate, proposedEndDate, email, areasOfInterest, qualifications, teacherQualifications, more',
      errorMessage: errorMessage,
    },
    callback
  );
};

VolunteerSubmission.defaultSort = '-createdAt';
VolunteerSubmission.defaultColumns = 'name, email, enquiryType, createdAt';
VolunteerSubmission.register();
