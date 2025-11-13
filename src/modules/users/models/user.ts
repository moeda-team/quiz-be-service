export interface User {
  id: string;
  name: string;
  password: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  deletedAt: Date;
  deletedBy: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

export interface DeleteUserDTO {
  id: string[];
}

export interface RequestResetPasswordUserDTO {
  email: string;
}

export interface ResetPasswordUserDTO {
  email: string;
}

export interface UpdateUserDTO extends CreateUserDTO {}
