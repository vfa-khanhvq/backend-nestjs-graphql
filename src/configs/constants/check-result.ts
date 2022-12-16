export const CHECK_RESULT = {
  OK: '0',
  NG: '1',
  UKN: '2',
  ERR: '3',
};

export const CREDIT_LIMIT = 400000;
export const SNR_DELETED_VALUE = 99999;

export const THIS_YEAR = new Date().getFullYear();
export const DEFAULT_VALUE = null;
export const LIST_STEPS = {
  invalidCardCheckResult: 1,
  notTarget: 1,
  branchlockResult: 1,
  ycustomerResult: 1,
  moneyShortageResult: 1,
  nisaResult: 1,
  nameMatchingResult: 1,
  authSalesResult: 3,
  snrfileFundsId: 4,
  snrfileDepositsId: 5,
};
export const DEFAULT_STEP = 0;
export const RESULT_STEP = 6;
export const getKeySteps = (step, notNullKey?: boolean) => {
  const steps = [];
  for (const key in LIST_STEPS) {
    if (Object.prototype.hasOwnProperty.call(LIST_STEPS, key)) {
      const element = LIST_STEPS[key];
      if (notNullKey) {
        if (element >= step) {
          steps.push(key);
        }
      } else {
        if (element <= step) {
          steps.push(key);
        }
      }
    }
  }
  return steps;
};

export const getKeyStep = (step, notNullKey?: boolean) => {
  const steps = [];
  for (const key in LIST_STEPS) {
    if (Object.prototype.hasOwnProperty.call(LIST_STEPS, key)) {
      const element = LIST_STEPS[key];
      if (notNullKey) {
        if (element === step) {
          steps.push(key);
        }
      } else {
        if (element <= step) {
          steps.push(key);
        }
      }
    }
  }
  return steps;
};
export const NOT_TARGET = 'notTarget';
