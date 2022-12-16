import { BaseException } from './base.exception';
import * as joi from 'joi';
export class JoiException extends BaseException<joi.ValidationErrorItem[]> {
  constructor(error: joi.ValidationError) {
    super('INPUT_INVALID', error.message, error.details);
  }
}
