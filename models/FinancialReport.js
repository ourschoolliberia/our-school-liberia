var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * FinancialReport Model
 * =====================
 */

var FinancialReport = new keystone.List('FinancialReport', {
	map: { name: 'year' },
	autokey: { path: 'slug', from: 'year', unique: true },
	format: 'YYYY',
	defaultSort: '-year'
});

FinancialReport.add({
	year: { type: Types.Date, required: true, default: '', initial: true },
	// report: { 
	// 	type: Types.S3File,
	// 	s3path: 'data/financialreports',
	// 	// allowedTypes: ['pdf'],
	// 	// filename: function(item, filename) {
	// 	// 	return 'test.pdf';
	// 	// }
	// },
});

FinancialReport.defaultColumns = 'year';
FinancialReport.register();
