import { Request, Response } from 'express';
import { logger } from '../../../utils/common/logger';
import { ResponseHandler } from '../../../utils/response/responseHandler';
import prisma from '../../../lib/prisma';
import { UserRole } from '../../../utils/auth/jwt';

export class UserController {
  async getAllStudents(req: Request, res: Response) {
    try {
      const students = await prisma.users.findMany({
        select: {
          id: true,
          name: true,
          email: true,
        },
        where: { role: UserRole.STUDENT, deleted_at: null },
        orderBy: {
          created_at: 'desc',
        },
      });
      return ResponseHandler.success(res, {
        message: 'Students retrieved successfully',
        data: students,
      });
    } catch (error) {
      logger.error('Error getting students:', error);
      return ResponseHandler.error(res, {
        message: 'Internal server error',
        statusCode: 500,
      });
    }
  }

  async getUserById(req: Request, res: Response) {
    const id = req.params.id;

    try {
      const students = await prisma.users.findFirst({
        select: {
          id: true,
          name: true,
          email: true,
        },
        where: { id: id, deleted_at: null },
      });
      if (!students) {
        return ResponseHandler.error(res, {
          message: 'User not found',
          statusCode: 404,
        });
      }

      return ResponseHandler.success(res, {
        message: 'User retrieved successfully',
        data: students,
      });
    } catch (error) {
      logger.error('Error getting students:', error);
      return ResponseHandler.error(res, {
        message: 'Internal server error',
        statusCode: 500,
      });
    }
  }
}
