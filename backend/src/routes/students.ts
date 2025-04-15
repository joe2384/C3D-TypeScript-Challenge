import {
  getStudents,
  patchStudent,
  postStudent,
} from "../controllers/students";

import express from "express";

const router = express.Router();

router.get("/", getStudents);
router.post("/", postStudent);
router.patch("/:id", patchStudent);

export default router;
