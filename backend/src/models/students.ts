import knex from "knex";
import knexConfig from "../db/knexfile";
const db = knex(knexConfig.development);

export interface Student {
  id?: number;
  name: string;
  email: string;
  graduation_year?: number;
  phone_number?: string;
  gpa?: number;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  created_at?: Date;
  updated_at?: Date;
}

export const createStudent = async (student: Student): Promise<number[]> => {
  return db("students").insert(student);
};

export const updateStudent = async (
  id: number,
  student: Partial<Student>
): Promise<number> => {
  return db("students").where({ id }).update(student);
};

export const getStudentById = async (
  id: number
): Promise<Student | undefined> => {
  return db("students").where({ id }).first();
};
