var keystone = require('keystone');
var Types = keystone.Field.Types;
var keystoneStorageAdapterS3 = require("keystone-storage-adapter-s3");

// test
var randToken = require('rand-token');
var nameStorage = require('keystone-storage-namefunctions');
// ******


var AnnualReport = new keystone.List('AnnualReport', {
	label: 'File',
	track: {
		createdBy: true,
		updatedBy: true,
		createdAt: true,
		updatedAt: true
	},
	map: { name: 'title' },
	autokey: { path: 'slug', from: '_id', unique: true }
});


/**
 * AnnualReport Model
 * =====================
 */
 // set up storage adapter for Amazon S3 Storage
 var AWSStorage = new keystone.Storage({
   adapter: require('keystone-storage-adapter-s3'),
   s3: {
	    key: process.env.S3_KEY, // required; defaults to process.env.S3_KEY
  		secret: process.env.S3_SECRET, // required; defaults to process.env.S3_SECRET
  		bucket: process.env.S3_BUCKET, // required; defaults to process.env.S3_BUCKET
  	  region: process.env.S3_REGION, // optional; defaults to process.env.S3_REGION, or if that's not specified, us-east-1
		 // key: 'AKIAJX5DCK42IHWLYY3Q', // pers account: 'AKIAIUPWGLIDAQ3FTFIQ', // IAM account: 'AKIAJX5DCK42IHWLYY3Q', // required; defaults to process.env.S3_KEY
     // secret: '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', // pers account: 'nt0PRydNnLMzDpDPyWsLCZlPcP27X9eaJOD6fAAR', // IAM account: '5DVj+4aY7xSyMVpHzvqLprDxZFhHL6a0ybPVqu9o', // required; defaults to process.env.S3_SECRET
     // bucket: 'our-school-liberia1', // required; defaults to process.env.S3_BUCKET
     // path: '/Annual_Reports',
     headers: {
       'x-amz-acl': 'public-read', // add default headers; see below for details
     },
     generateFilename: keystone.Storage.originalFilename
   },
   schema: {
     // size: true,
     // mimetype: true,
     bucket: true, // optional; store the bucket the file was uploaded to in your db
     etag: true, // optional; store the etag for the resource
     path: true, // optional; store the path of the file in your db
     url: true, // optional; generate & store a public URL
   },
 });

// Test
// var AnnualReport = new keystone.List('AnnualReport', {
// 	map: { name: 'title' },
// 	autokey: { path: 'slug', from: 'title', unique: true },
// 	defaultSort: '-dateReleased'
// });
// *****

// Test
// AnnualReport.add({
// 	title: { type: String },
// 	pdfFile: { type: Types.File, storage: storage },
// 	dateReleased: { type: Types.Date, format: 'dddd DD MMM YY' },
//
// });
// ******

AnnualReport.add({
	title: { type: Types.Text, hidden: true, index: true },
  dateReleased: { type: Types.Date, format: 'dddd DD MMM YY' },
  file: {
		type: Types.File,
		storage: AWSStorage,
		// note: 'Upload dependencies.',
		// initial: true,
		// createInline: true,
		// allowedTypes: ['pdf','gzip','zip','xz','gz','bz2']
	}
	// service: {
	// 	type: Types.Select,
	// 	default: 'aws-s3',
	// 	options: [
	// 		{ value: 'aws-s3', label: 'Amazon Web Services: S3' }
	// 	],
	// 	hidden: true,
	// 	required: true
	// },
	// version: { type: Types.Number, default: 1, hidden: true },
	// url: { type: Types.Url, note:'The source URL.', initial: true },
	// description: { type: Types.Textarea, height: 50 },
	// notes: { type: Types.Textarea, height: 150 },
	// state: { type: Types.Select, options: 'draft, published, archived, spam', default: 'published', index: true }
});

// AnnualReport.schema.pre('save', function (next) {
// 	var self = this;
//
//   console.log('File name ::: '+this.file.filename);
//
// 	// Use the original filename as the title.
// 	if(this.file.filename){
// 		self.title = this.file.filename;
// 	} else {
// 		self.title = randToken.generate(16);
// 	}
// 	AnnualReport.model.findOne({
// 		title: self.title,
// 	})
// 	.sort('-updatedAt')
// 	.exec(function(err, existing) {
// 		if(err) {
// 			console.log('ERROR: File - There was an error finding the benchmark file during pre save.');
// 		}
// 		if(existing) {
// 			// Increase the version
// 			version = parseInt(existing.version + 1);
// 			self.title = self.title + '_v' + version;
// 			self.version = version;
// 		}
// 		next();
// 	});
// });

// AnnualReport.relationship({ ref: 'Benchmark', path: 'benchmarks', refPath: 'files' });

AnnualReport.defaultColumns = 'title';
// AnnualReport.defaultColumns = 'title, dateReleased';
AnnualReport.register();
