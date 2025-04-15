import { Request, Response } from "express";
import {
  Student,
  createStudent,
  getStudentById,
  queryStudents,
  updateStudent,
} from "../models/students";

export const getStudents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { search, minGpa, maxGpa, graduationYear, city, state } = req.query;

    const sortByRaw = req.query.sortBy;
    const sortOrderRaw = req.query.sortOrder;

    const sortBy = Array.isArray(sortByRaw) ? sortByRaw[0] : sortByRaw;
    const sortOrder = Array.isArray(sortOrderRaw)
      ? sortOrderRaw[0]
      : sortOrderRaw;

    const validSortFields = ["name", "gpa", "graduation_year", "city", "state"];
    const sortField = validSortFields.includes(sortBy as string)
      ? (sortBy as string)
      : "name";
    const order = sortOrder === "desc" ? "desc" : "asc";

    const students = await queryStudents({
      search: search as string,
      minGpa: minGpa ? parseFloat(minGpa as string) : undefined,
      maxGpa: maxGpa ? parseFloat(maxGpa as string) : undefined,
      graduationYear: graduationYear
        ? parseInt(graduationYear as string, 10)
        : undefined,
      city: city as string,
      state: state as string,
      sortBy: sortField,
      sortOrder: order,
    });

    res.status(200).json({ students });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

export const postStudent = async (req: Request, res: Response) => {
  try {
    const student: Student = req.body;

    const requiredFields: (keyof Student)[] = [
      "name",
      "email",
      "graduation_year",
      "phone_number",
      "gpa",
      "city",
      "state",
    ];

    const missingFields = requiredFields.filter((field) => {
      const value = student[field];
      return value === undefined || value === null || value === "";
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const [id] = await createStudent(student);
    res.status(201).json({ message: "Student created successfully", id });
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const patchStudent = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID format" });

    const existing = await getStudentById(id);
    if (!existing) return res.status(404).json({ error: "Student not found" });

    await updateStudent(id, req.body);
    res.status(200).json({ message: "Student updated successfully" });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
