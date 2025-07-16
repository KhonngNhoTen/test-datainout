/** @type {import("datainout").DataInoutConfigOptions} */
module.exports = {
  dateFormat: 'DD-MM-YYYY hh:mm:ss',
  templateExtension: '.js',
  import: {
    templateDir: './templates/imports',
    excelSampleDir: './excels',
  },
  report: {
    templateDir: './templates/reports',
    reportDir: './excels',
  },
};
