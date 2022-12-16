export const SHOP_ID = process.env.GMO_SHOP_ID || 'tshop00055618';
export const PROCESSING_DIVISION =
  process.env.GMO_PROCESSING_DIVISION || 'CAPTURE';
export const PAYMENT_METHOD = process.env.GMO_PAYMENT_METHOD
  ? parseInt(process.env.GMO_PAYMENT_METHOD, 10)
  : 1;
export const ACCOUNT_TYPE = {
  DEFAULT: 0,
  NISA: 1,
  TSUMITATE_NISA: 2,
};
export const GMO_STATUS_CODE = {
  INVALID: 'INVALID',
  REGISTER: 'REGISTER',
  COMPLETE: 'COMPLETE',
  FAIL: 'FAIL',
};
export const CARD_ERRORS = new Map<string, string>([
  ['E11010099', 'E11'],
  ['E11010100', 'E11'],
  ['42G120000', 'G12'],
  ['42G220000', 'G22'],
  ['42G300000', 'G30'],
  ['42G540000', 'G54'],
  ['42G560000', 'G56'],
  ['42G600000', 'G60'],
  ['42G610000', 'G61'],
  ['42G920000', 'G92'],
  ['42G950000', 'G95'],
  ['42G960000', 'G96'],
  ['42G970000', 'G97'],
  ['42G980000', 'G98'],
  ['42G990000', 'G99'],
]);
