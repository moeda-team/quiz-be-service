import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { ResponseHandler } from '../../../utils/response/responseHandler';

export const validateAssignStudent = [
  body('student_id')
    .isArray({ min: 1 })
    .withMessage('Student ID must be an array and cannot be empty'),

  body('student_id.*')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Each Student ID must be a non-empty string'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, {
        message: 'Validation failed',
        statusCode: 400,
        error: {
          code: 'VALIDATION_FAILED',
          details: errors.array(),
        },
      });
    }
    next();
  },
];
