export interface Course {
  id: string;
  class_id: string;
  name: string;
  description: string;
  video_title: string;
  video: string;
  order: number;
  created_at: Date;
  created_by: string;
  updated_at: Date;
  updated_by: string;
  deleted_at: Date;
  deleted_by: string;
}

export interface CreateCourseDTO {
  name: string;
  description: string;
  video_title: string;
  video: string;
}

export interface UpdateCourseDTO {
  name: string;
  description: string;
  video_title: string;
  video: string;
  order: number;
}
