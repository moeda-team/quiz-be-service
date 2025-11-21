export interface Class {
  id: string;
  name: string;
  description: string;
  teacher_id: string;
  subject: string;
  room: string;
  created_at: Date;
  created_by: string;
  updated_at: Date;
  updated_by: string;
  deleted_at: Date;
  deleted_by: string;
}

export interface CreateClassDTO {
  name: string;
  description: string;
  teacher_id: string;
  subject: string;
  room: string;
  day: string;
  start_time: string;
  end_time: string;
}

export interface UpdateClassDTO {
  name: string;
  description: string;
  subject: string;
  room: string;
  day: string;
  start_time: string;
  end_time: string;
}

export interface AssignStudentDTO {
  student_id: string[];
}
