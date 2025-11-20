import { Request, Response } from 'express';
import { logger } from '../../../utils/common/logger';
import { ResponseHandler } from '../../../utils/response/responseHandler';
import prisma from '../../../lib/prisma';
import { CreateClassDTO, UpdateClassDTO } from '../models/class';
import { schedule } from 'node-cron';

export class ClassController {
  async getAllClasses(req: Request, res: Response) {
    try {
      const classes = await prisma.classes.findMany({
        where: { deleted_at: null },
        orderBy: {
          created_at: 'desc',
        },
      });
      return ResponseHandler.success(res, {
        message: 'Classes retrieved successfully',
        data: classes,
      });
    } catch (error) {
      logger.error('Error getting classes:', error);
      return ResponseHandler.error(res, {
        message: 'Internal server error',
        statusCode: 500,
      });
    }
  }

  async getClassById(req: Request, res: Response) {
    const id = req.params.id;

    try {
      const classes = await prisma.classes.findFirst({
        where: { id: id, deleted_at: null },
        include: {
          teacher: true,
          schedules: true,
          students: true,
          tasks: true,
        },
      });
      if (!classes) {
        return ResponseHandler.error(res, {
          message: 'Class not found',
          statusCode: 404,
        });
      }

      return ResponseHandler.success(res, {
        message: 'Class retrieved successfully',
        data: classes,
      });
    } catch (error) {
      logger.error('Error getting classes:', error);
      return ResponseHandler.error(res, {
        message: 'Internal server error',
        statusCode: 500,
      });
    }
  }

  async createClass(req: Request, res: Response) {
    const { user } = req as Request & { user: { userId: string } };
    const classData: CreateClassDTO = req.body;

    try {
      classData.teacher_id = user.userId;
      const teacher = await prisma.users.findUnique({
        where: { id: classData.teacher_id, role: 'teacher' },
      });
      if (!teacher) {
        return ResponseHandler.error(res, {
          message: 'Teacher not found',
          statusCode: 404,
        });
      }

      const classes = await prisma.classes.create({
        data: {
          name: classData.name,
          description: classData.description,
          subject: classData.subject,
          room: classData.room,
          teacher_id: user.userId,
          created_at: new Date(),
          created_by: user.userId,
        },
      });
      if (!classes) {
        return ResponseHandler.error(res, {
          message: 'Class not created',
          statusCode: 404,
        });
      }

      const schedule = await prisma.schedules.create({
        data: {
          class_id: classes.id,
          teacher_id: user.userId,
          day: classData.day,
          start_time: classData.start_time,
          end_time: classData.end_time,
          created_at: new Date(),
          created_by: user.userId,
        },
      });
      if (!schedule) {
        await prisma.classes.delete({
          where: { id: classes.id },
        });
        return ResponseHandler.error(res, {
          message: 'Schedule not created',
          statusCode: 404,
        });
      }

      return ResponseHandler.success(res, {
        message: 'Class created successfully',
        data: classes,
      });
    } catch (error) {
      logger.error('Error creating user:', error);
      return ResponseHandler.error(res, {
        message: 'Internal server error',
        statusCode: 500,
      });
    }
  }

  async updateClass(req: Request, res: Response) {
    const { user } = req as Request & { user: { userId: string } };
    const classData: UpdateClassDTO = req.body;
    const id = req.params.id;

    try {
      const teacher_id = user.userId;
      const teacher = await prisma.users.findUnique({
        where: { id: teacher_id, role: 'teacher' },
      });
      if (!teacher) {
        return ResponseHandler.error(res, {
          message: 'Teacher not found',
          statusCode: 404,
        });
      }

      const getClass = await prisma.classes.findFirst({
        where: { id: id, teacher_id: teacher_id, deleted_at: null },
        include: {
          schedules: true,
        },
      });
      if (!getClass) {
        return ResponseHandler.error(res, {
          message: 'Class not found',
          statusCode: 404,
        });
      }

      const result = await prisma.classes.update({
        where: { id: id, teacher_id: teacher_id, deleted_at: null },
        data: {
          name: classData.name,
          description: classData.description,
          subject: classData.subject,
          room: classData.room,
          updated_at: new Date(),
          updated_by: user.userId,
        },
      });

      const schedule_id = getClass.schedules[0].id;
      const schedule = await prisma.schedules.update({
        where: { id: schedule_id, deleted_at: null },
        data: {
          day: classData.day,
          start_time: classData.start_time,
          end_time: classData.end_time,
          updated_at: new Date(),
          updated_by: user.userId,
        },
      });
      if (!schedule) {
        return ResponseHandler.error(res, {
          message: 'Schedule not updated',
          statusCode: 404,
        });
      }
      return ResponseHandler.success(res, {
        message: 'Class updated successfully',
        data: result,
      });
    } catch (error) {
      logger.error('Error updating user:', error);
      return ResponseHandler.error(res, {
        message: 'Internal server error',
        statusCode: 500,
      });
    }
  }

  async deleteClass(req: Request, res: Response) {
    const { user } = req as Request & { user: { userId: string } };
    const id = req.params.id;

    try {
      const classes = await prisma.classes.update({
        where: { id: id, deleted_at: null },
        data: {
          deleted_at: new Date(),
          deleted_by: user.userId,
        },
      });
      return ResponseHandler.success(res, {
        message: 'Class deleted successfully',
        data: classes,
      });
    } catch (error) {
      logger.error('Error deleting user:', error);
      return ResponseHandler.error(res, {
        message: 'Internal server error',
        statusCode: 500,
      });
    }
  }
}
