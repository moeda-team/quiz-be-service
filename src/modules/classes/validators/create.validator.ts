import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { ResponseHandler } from '../../../utils/response/responseHandler';

export const validateCreateUser = [
  body('name').trim().notEmpty().withMessage('Name is required'),

  body('description').trim().optional(),

  body('subject').trim().notEmpty().withMessage('Subject is required'),

  body('room').trim().optional(),

  body('day')
    .trim()
    .isIn(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'])
    .notEmpty()
    .withMessage('Day is required'),

  body('start_time')
    .trim()
    .isTime({ hourFormat: 'hour24' })
    .notEmpty()
    .withMessage('Start time is required'),

  body('end_time')
    .trim()
    .isTime({ hourFormat: 'hour24' })
    .notEmpty()
    .withMessage('End time is required'),

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
