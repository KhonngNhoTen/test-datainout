/** @type {import("inoutjs").ExcelFormat} */
const template = {
  sheets: [
    {
      cells: [
        {
          address: 'A1',
          isVariable: false,
          style: {},
          value: { hardValue: 'Name' },
          section: 'header',
          fullAddress: { sheetName: 'Sheet1', address: 'A1', row: 1, col: 1 },
        },
        {
          address: 'B1',
          isVariable: false,
          style: {},
          value: { hardValue: 'Email' },
          section: 'header',
          fullAddress: { sheetName: 'Sheet1', address: 'B1', row: 1, col: 2 },
        },
        {
          address: 'C1',
          isVariable: false,
          style: {},
          value: { hardValue: 'Password' },
          section: 'header',
          fullAddress: { sheetName: 'Sheet1', address: 'C1', row: 1, col: 3 },
        },
        {
          address: 'D1',
          isVariable: false,
          style: {},
          value: { hardValue: 'Phone' },
          section: 'header',
          fullAddress: { sheetName: 'Sheet1', address: 'D1', row: 1, col: 4 },
        },
        {
          address: 'E1',
          isVariable: false,
          style: {},
          value: { hardValue: 'Age' },
          section: 'header',
          fullAddress: { sheetName: 'Sheet1', address: 'E1', row: 1, col: 5 },
        },
        {
          address: 'F1',
          isVariable: false,
          style: {},
          value: { hardValue: 'DoB' },
          section: 'header',
          fullAddress: { sheetName: 'Sheet1', address: 'F1', row: 1, col: 6 },
        },
        {
          address: 'A',
          isVariable: true,
          style: {},
          value: { fieldName: 'name' },
          section: 'table',
          fullAddress: { sheetName: 'Sheet1', address: 'A2', row: 2, col: 1 },
        },
        {
          address: 'B',
          isVariable: true,
          style: {},
          value: { fieldName: 'email' },
          section: 'table',
          fullAddress: { sheetName: 'Sheet1', address: 'B2', row: 2, col: 2 },
        },
        {
          address: 'C',
          isVariable: true,
          style: {},
          value: { fieldName: 'password' },
          section: 'table',
          fullAddress: { sheetName: 'Sheet1', address: 'C2', row: 2, col: 3 },
        },
        {
          address: 'D',
          isVariable: true,
          style: {},
          value: { fieldName: 'phone' },
          section: 'table',
          fullAddress: { sheetName: 'Sheet1', address: 'D2', row: 2, col: 4 },
        },
        {
          address: 'E',
          isVariable: true,
          style: {},
          value: { fieldName: 'age' },
          section: 'table',
          fullAddress: { sheetName: 'Sheet1', address: 'E2', row: 2, col: 5 },
        },
        {
          address: 'F',
          isVariable: true,
          style: {},
          value: { fieldName: 'dob' },
          section: 'table',
          fullAddress: { sheetName: 'Sheet1', address: 'F2', row: 2, col: 6 },
        },
      ],
      rowHeights: [],
      columnWidths: [null, null, null, null, null, null],
      beginTableAt: 1,
      endTableAt: 2,
      merges: {},
      sheetIndex: 1,
      sheetName: 'Sheet1',
      keyTableAt: 2,
    },
  ],
  name: '',
};
module.exports = template;
