import { patchStudent, postStudent } from "../controllers/students";

import { authenticate } from "../middleware/authMiddleware";
import express from "express";

const router = express.Router();

router.post("/", authenticate, postStudent);
router.patch("/:id", authenticate, patchStudent);

export default router;
