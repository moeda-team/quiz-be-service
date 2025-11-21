export interface Courses {
  id: string;
  class_id: string;
  name: string;
  description: string;
  video_title: string;
  video: string;
  order: number;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  deletedAt: Date;
  deletedBy: string;
}

export interface CreateCourseDTO {
  name: string;
  description: string;
  class_id: string;
  video_title: string;
  video: string;
  order: number;
}
