var keystone = require('keystone');
var Types = keystone.Field.Types;
var keystoneStorageAdapterS3 = require('keystone-storage-adapter-s3');

var AnnualReport = new keystone.List('AnnualReport', {
  label: 'Annual Reports',
  track: {
    createdBy: true,
    updatedBy: true,
    createdAt: true,
    updatedAt: true,
  },
  map: { name: 'title' },
  autokey: { path: 'slug', from: '_id', unique: true },
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
    // path: '/Annual_Reports',
    'default headers': {
      'x-amz-meta-X-Default-Header': 'Custom Default Value',
    },
    generateFilename: keystone.Storage.originalFilename,
  },
  schema: {
    mimetype: true,
    bucket: true, // optional; store the bucket the file was uploaded to in your db
    etag: true, // optional; store the etag for the resource
    path: true, // optional; store the path of the file in your db
    url: true, // optional; generate & store a public URL
  },
});

AnnualReport.add({
  title: { type: Types.Text, hidden: true, index: true },
  dateReleased: { type: Types.Date, format: 'dddd DD MMM YY' },
  file: {
    type: Types.File,
    storage: AWSStorage,
    // allowedTypes: ['pdf','gzip','zip','xz','gz','bz2']
  },
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

AnnualReport.schema.post('remove', function(file) {
  //Workaround as delete file bug is not yet fixed in "keystone-storage-adapter-s3"
  var AWS = require('aws-sdk');

  AWS.config = new AWS.Config();
  AWS.config.accessKeyId = process.env.S3_KEY;
  AWS.config.secretAccessKey = process.env.S3_SECRET;
  AWS.config.region = process.env.S3_REGION;

  var s3 = new AWS.S3();

  var params = {
    Bucket: process.env.S3_BUCKET,
    Key: file.file.filename,
  };

  s3.deleteObject(params, function(err, data) {
    if (err) console.log(err);
  });
});

AnnualReport.defaultColumns = 'title';
AnnualReport.register();
