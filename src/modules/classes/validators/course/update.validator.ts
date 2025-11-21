import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { ResponseHandler } from '../../../../utils/response/responseHandler';

export const validateUpdateCourse = [
  body('name').trim().notEmpty().withMessage('Name is required'),

  body('description').trim().optional(),

  body('video_title').trim().optional(),

  body('video').trim().optional(),

  body('order')
    .trim()
    .notEmpty()
    .withMessage('Order is required')
    .isInt()
    .withMessage('Order must be an integer')
    .toInt(),

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
