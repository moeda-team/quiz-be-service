import { Request, Response } from 'express';
import { logger } from '../../../utils/common/logger';
import { ResponseHandler } from '../../../utils/response/responseHandler';
import prisma from '../../../lib/prisma';
import { CreateCourseDTO } from '../models/courses';

export class CoursesController {
  async getAllCourses(req: Request, res: Response) {
    try {
      const students = await prisma.courses.findMany({
        where: { deleted_at: null },
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

  async getCourseById(req: Request, res: Response) {
    const id = req.params.id;

    try {
      const students = await prisma.courses.findFirst({
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

  async createCourse(req: Request, res: Response) {
    const { user } = req as Request & { user: { userId: string } };
    const courseData: CreateCourseDTO = req.body;

    try {
      const classes = await prisma.classes.findUnique({
        where: { id: courseData.class_id, deleted_at: null },
      });
      if (!classes) {
        return ResponseHandler.error(res, {
          message: 'Class not found',
          statusCode: 404,
        });
      }

      const course = await prisma.courses.create({
        data: {
          ...courseData,
          created_by: user.userId,
        },
      });
      return ResponseHandler.success(res, {
        message: 'Course created successfully',
        data: course,
      });
    } catch (error) {
      logger.error('Error creating course:', error);
      return ResponseHandler.error(res, {
        message: 'Internal server error',
        statusCode: 500,
      });
    }
  }
}
