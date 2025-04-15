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

interface QueryParams {
  search?: string;
  minGpa?: number;
  maxGpa?: number;
  graduationYear?: number;
  city?: string;
  state?: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export const queryStudents = async (
  params: QueryParams
): Promise<Student[]> => {
  const query = db<Student>("students");

  const {
    search,
    minGpa,
    maxGpa,
    graduationYear,
    city,
    state,
    sortBy,
    sortOrder,
  } = params;

  if (search) {
    query.where((builder) => {
      builder
        .whereILike("name", `%${search}%`)
        .orWhereILike("city", `%${search}%`)
        .orWhereILike("state", `%${search}%`);
    });
  }

  if (minGpa !== undefined) query.where("gpa", ">=", minGpa);
  if (maxGpa !== undefined) query.where("gpa", "<=", maxGpa);
  if (graduationYear !== undefined)
    query.where("graduation_year", graduationYear);
  if (city) query.whereILike("city", `%${city}%`);
  if (state) query.whereILike("state", `%${state}%`);

  query.orderBy(sortBy, sortOrder);

  return query;
};

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
