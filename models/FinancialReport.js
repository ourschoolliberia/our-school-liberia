var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * FinancialReport Model
 * =====================
 */

var FinancialReport = new keystone.List('FinancialReport', {
	map: { name: 'year' },
	autokey: { path: 'slug', from: 'year', unique: true }
});

FinancialReport.add({
	year: { type: Types.Name, required: true, default: '', initial: true },
	// report: { 
	// 	type: Types.S3File,
	// 	s3path: '/data/financialreports',
	// 	// allowedTypes: ['pdf'],
	// 	filename: function(item, filename) {
	// 		return 'test.pdf';
	// 	}
	// },
});

FinancialReport.defaultColumns = 'name, type|20%, role|20%, image|20%';
FinancialReport.register();
