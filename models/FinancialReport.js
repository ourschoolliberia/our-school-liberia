var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * FinancialReport Model
 * =====================
 */

 var storage = new keystone.Storage({
  adapter: require('keystone-storage-adapter-s3'),
  s3: {
    key: 's3-key', // required; defaults to process.env.S3_KEY
    secret: 'secret', // required; defaults to process.env.S3_SECRET
    bucket: 'mybucket', // required; defaults to process.env.S3_BUCKET
    region: 'ap-southeast-2', // optional; defaults to process.env.S3_REGION, or if that's not specified, us-east-1
    path: 'data/financialreports',
    headers: {
      'x-amz-acl': 'public-read', // add default headers; see below for details
    },
  },
  schema: {
    bucket: true, // optional; store the bucket the file was uploaded to in your db
    etag: true, // optional; store the etag for the resource
    path: true, // optional; store the path of the file in your db
    url: true, // optional; generate & store a public URL
  },
});

var FinancialReport = new keystone.List('FinancialReport', {
	map: { name: 'year' },
	autokey: { path: 'slug', from: 'year', unique: true },
	format: 'YYYY',
	defaultSort: '-year'
});

FinancialReport.add({
	year: { type: Types.Date, required: true, default: '', initial: true },
	report: { 
		type: Types.File,
		storage: storage,
		filename: function(item, filename) {
			debugger;
			return 'financial-report-' + item._.year.format('YYYY') + '.pdf';
		}
	},
});

FinancialReport.defaultColumns = 'year';
FinancialReport.register();
