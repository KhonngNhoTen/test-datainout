/** @type {import("datainout").ImportFileDesciptionOptions} */
const template = {
  sheets: [
    {
      cells: [
        {
          keyName: 'name',
          section: 'table',
          type: 'string',
          address: 'A',
          fullAddress: { sheetName: 'Sheet1', address: 'A2', row: 2, col: 1 },
        },
        {
          keyName: 'email',
          section: 'table',
          type: 'string',
          address: 'B',
          fullAddress: { sheetName: 'Sheet1', address: 'B2', row: 2, col: 2 },
        },
        {
          keyName: 'password',
          section: 'table',
          type: 'string',
          address: 'C',
          fullAddress: { sheetName: 'Sheet1', address: 'C2', row: 2, col: 3 },
        },
        {
          keyName: 'phone',
          section: 'table',
          type: 'string',
          address: 'D',
          fullAddress: { sheetName: 'Sheet1', address: 'D2', row: 2, col: 4 },
        },
        {
          keyName: 'age',
          section: 'table',
          type: 'number',
          address: 'E',
          fullAddress: { sheetName: 'Sheet1', address: 'E2', row: 2, col: 5 },
        },
        {
          keyName: 'dob',
          section: 'table',
          type: 'string',
          address: 'F',
          fullAddress: { sheetName: 'Sheet1', address: 'F2', row: 2, col: 6 },
          setValue: (data) => new Date(data),
        },
      ],
      endTableAt: 2,
      sheetName: 'Sheet1',
      beginTableAt: 1,
      keyTableAt: 2,
      sheetIndex: 1,
    },
  ],
  name: '',
};
module.exports = template;
