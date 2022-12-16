export const GRANT_TYPE = 'password';
export const TOKEN_TYPE = 'bearer';
export const SALT_ROUNDS = 10;
export const ROLE = 'role';
export const ROLES = {
  ADMIN: 0,
  SUPER_ADMIN: 1,
};
export const TRANSACTION_STEPS = {
  resetOrder: 1,
  resetOrderAll: 2,
  removeSnrRecord: 3,
  handleCheckResults: 4,
  getGmoData: 5,
  updateGmoData: 6,
  createOrderListToSNR: 7,
  createPaymentsToSnr: 8,
};
export const PROCESS_TIMEOUT_MINUTE =
  parseInt(process.env.PROCESS_TIMEOUT_MINUTE, 10) || 60;
export const ORDER_DATE_KEY = 'orderDate';
