import { Request, Response } from 'express';
import { logger } from '../../../utils/common/logger';
import {
  CreateUserDTO,
  UpdateUserDTO,
  DeleteUserDTO,
  RequestResetPasswordUserDTO,
} from '../models/user';
import { ResponseHandler } from '../../../utils/response/responseHandler';
import prisma from '../../../lib/prisma';
import { hashPassword } from '../../../utils/auth/hash';
import { sendResetPasswordEmail } from '../../../utils/mail/resetPassword';

export class UserController {
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await prisma.users.findMany({
        select: {
          name: true,
          email: true,
          role: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      });
      return ResponseHandler.success(res, {
        message: 'Users retrieved successfully',
        data: users,
      });
    } catch (error) {
      logger.error('Error getting users:', error);
      return ResponseHandler.error(res, {
        message: 'Internal server error',
        statusCode: 500,
      });
    }
  }

  async getUserById(req: Request, res: Response) {
    const { user } = req as Request & { user?: { userId: string } };
    const id = user?.userId;

    try {
      const users = await prisma.users.findFirst({
        select: {
          name: true,
          email: true,
          role: true,
        },
        where: { id: id, deleted_at: null },
      });
      if (!users) {
        return ResponseHandler.error(res, {
          message: 'User not found',
          statusCode: 404,
        });
      }

      return ResponseHandler.success(res, {
        message: 'User retrieved successfully',
        data: users,
      });
    } catch (error) {
      logger.error('Error getting users:', error);
      return ResponseHandler.error(res, {
        message: 'Internal server error',
        statusCode: 500,
      });
    }
  }

  async resetPassword(req: Request, res: Response) {
    const payload: RequestResetPasswordUserDTO = req.body;

    try {
      const user = await prisma.users.findFirst({
        where: { email: payload.email, deleted_at: null },
      });
      if (!user) {
        return ResponseHandler.error(res, {
          message: 'User not found',
          statusCode: 404,
        });
      }

      try {
        const emailSent = await sendResetPasswordEmail(
          'lovantoqwerty@gmail.com',
          'https://quizkuy.com/reset-password',
        );
        if (emailSent) {
          logger.info('Stock alert email sent successfully.');
        } else {
          logger.warn('Failed to send stock alert email');
        }
      } catch (error) {
        logger.error('Error in stock alert email process:', error);
      }

      return ResponseHandler.success(res, {
        message: 'User retrieved successfully',
        data: payload,
      });
    } catch (error) {
      logger.error('Error getting users:', error);
      return ResponseHandler.error(res, {
        message: 'Internal server error',
        statusCode: 500,
      });
    }
  }

  async createUser(req: Request, res: Response) {
    const userData: CreateUserDTO = req.body;

    try {
      const existingUser = await prisma.users.findFirst({
        where: {
          OR: [{ email: userData.email }],
        },
      });
      if (existingUser) {
        return ResponseHandler.error(res, {
          message: 'User already exists',
          statusCode: 400,
        });
      }

      const hashedPassword = await hashPassword(userData.password);

      const users = await prisma.users.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          created_at: new Date(),
          created_by: userData.name,
          updated_at: new Date(),
          updated_by: userData.name,
        },
      });
      return ResponseHandler.success(res, {
        message: 'User created successfully',
        data: users,
      });
    } catch (error) {
      logger.error('Error creating users:', error);
      return ResponseHandler.error(res, {
        message: 'Internal server error',
        statusCode: 500,
      });
    }
  }

  async updateUser(req: Request, res: Response) {
    const { user } = req as Request & { user?: { userId: string } };
    const userData: UpdateUserDTO = req.body;
    const id = user?.userId;

    try {
      const users = await prisma.users.findUnique({
        where: { id },
      });
      if (!users) {
        return ResponseHandler.error(res, {
          message: 'User not found',
          statusCode: 404,
        });
      }

      const existingUser = await prisma.users.findFirst({
        where: { email: userData.email },
      });
      if (existingUser && existingUser.id !== id) {
        return ResponseHandler.error(res, {
          message: 'Email is already in use',
          statusCode: 400,
        });
      }

      const hashedPassword = await hashPassword(userData.password);

      const updatedUser = await prisma.users.update({
        where: { id },
        data: {
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          updated_at: new Date(),
          updated_by: userData.name,
        },
        select: {
          name: true,
          email: true,
          role: true,
          created_at: true,
          created_by: true,
          updated_at: true,
          updated_by: true,
        },
      });

      return ResponseHandler.success(res, {
        message: 'User updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      logger.error('Error updating users:', error);
      return ResponseHandler.error(res, {
        message: 'Internal server error',
        statusCode: 500,
      });
    }
  }

  async deleteUser(req: Request, res: Response) {
    const { user } = req as Request & { user?: { userId: string } };
    const payload: DeleteUserDTO = req.body;
    const userId = user?.userId;

    try {
      const user = await prisma.users.findUnique({
        where: { id: userId },
      });
      if (!user) {
        return ResponseHandler.error(res, {
          message: 'User who delete not found',
          statusCode: 404,
        });
      }

      const users = await prisma.users.findMany({
        where: {
          id: {
            in: payload.id,
          },
        },
      });

      if (!users || users.length === 0) {
        return ResponseHandler.error(res, {
          message: 'Users not found',
          statusCode: 404,
        });
      }

      await prisma.users.updateMany({
        where: {
          id: {
            in: payload.id, // array of id
          },
        },
        data: {
          deleted_at: new Date(),
          deleted_by: user.name,
        },
      });

      return ResponseHandler.success(res, {
        message: 'User deleted successfully',
        data: null,
      });
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'P2025') {
        return ResponseHandler.error(res, {
          message: 'User not found',
          statusCode: 404,
        });
      }
      logger.error('Error deleting users:', error);
      return ResponseHandler.error(res, {
        message: 'Internal server error',
        statusCode: 500,
      });
    }
  }
}
