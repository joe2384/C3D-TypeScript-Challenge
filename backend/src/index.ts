import cors from "cors";
import express from "express";
import studentsRouter from "./routes/students";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/students", studentsRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
