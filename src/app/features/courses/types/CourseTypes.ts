export type FieldType = 'string' | 'number' | 'select' | 'boolean';

export interface FieldOption {
  label: string;
  value: string | number;
}

export interface CourseField {
  name: string;
  key: string;
  type: FieldType;
  required: boolean;
  options?: FieldOption[];
}

export interface Course {
  id: number;
  name: string;
  hours: number;
  fields: string[];
}

export interface CourseCreate {
  name: string;
  hours: number;
  fields: string[];
}

export const coursesName = {
  initials: "ФИО",
  inn: "ИНН",
  org: "ОРГ",
  safety: "Безопасность",
  reg_num: "Рег номер"
};

export type CoursesKeys = 'initials' | 'inn' | 'org' | 'safety' | 'reg_num';