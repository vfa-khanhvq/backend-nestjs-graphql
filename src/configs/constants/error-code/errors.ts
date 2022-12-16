export const ERRORS = {
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: '',
  },
  INTERNAL_SERVER_ERROR: {
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Internal Server Error',
  },
  /**
   * Token
   */
  TOKEN_EXPIRED: {
    code: 'TOKEN_EXPIRE',
    message: '',
  },
  TOKEN_INVALID: {
    code: 'TOKEN_INVALID',
    message: '',
  },
  /**
   * Input
   */
  INPUT_INVALID: {
    code: 'INPUT_INVALID',
  },

  /**
   * Date
   */
  INVALID_DATE: {
    code: 'INVALID_DATE',
    message: 'Invalid date',
  },
};

export const CHECK_ERROR = {
  CHECK_INVALID_CARD: {
    code: 'INVALID_CARD',
    message: 'Invalid Card',
  },
};

export const TICKET_ERROR = {
  DUPLICATE_MIYOTTO_ID: 'DUPLICATE_MIYOTTO_ID',
  NOT_FOUND_MIYOTTO_ID: 'NOT_FOUND_MIYOTTO_ID',
};

export const PROCESS_EXECUTION_DONE = {
  PROCESS_EXECUTION_DONE: {
    code: 'PROCESS_EXECUTION_DONE',
    message: 'Process excution done already',
  },
};
