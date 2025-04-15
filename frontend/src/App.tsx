import { AppDispatch, RootState } from "./store/store";
import {
  createStudent,
  fetchStudents,
  updateStudent,
} from "./store/students/studentSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import FormField from "./components/FormField";
import ListNavbar from "./components/ListNavbar";
import { Student } from "./types/student";

interface FormData {
  name: string;
  email: string;
  graduation_year: number;
  phone_number: string;
  gpa: number;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
}

const fields: {
  key: keyof FormData;
  label: string;
  type: string;
  required?: boolean;
}[] = [
  { key: "name", label: "Student Name", type: "text", required: true },
  { key: "email", label: "Email Address", type: "email", required: true },
  {
    key: "graduation_year",
    label: "Graduation Year",
    type: "number",
    required: true,
  },
  { key: "phone_number", label: "Phone Number", type: "text", required: true },
  { key: "gpa", label: "GPA", type: "number", required: true },
  { key: "city", label: "City", type: "text", required: true },
  { key: "state", label: "State", type: "text", required: true },
  { key: "latitude", label: "Latitude", type: "number", required: true },
  { key: "longitude", label: "Longitude", type: "number", required: true },
];

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { students, loading, error } = useSelector(
    (state: RootState) => state.students
  );

  const studentList = Array.isArray(students) ? students : [];

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    graduation_year: 2025,
    phone_number: "",
    gpa: 0,
    city: "",
    state: "",
    latitude: 0,
    longitude: 0,
  });

  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  const validateFormData = (
    data: FormData
  ): { [K in keyof FormData]?: string } => {
    const errors: { [K in keyof FormData]?: string } = {};

    if (!data.name.trim()) errors.name = "Name is required.";
    if (!/\S+@\S+\.\S+/.test(data.email))
      errors.email = "Invalid email address.";
    if (data.graduation_year < 1900 || data.graduation_year > 2100)
      errors.graduation_year = "Enter a valid graduation year.";
    if (!/^\d{3}-\d{3}-\d{4}$/.test(data.phone_number))
      errors.phone_number = "Phone number must be in format 123-456-7890.";
    if (data.gpa < 0 || data.gpa > 4.0)
      errors.gpa = "GPA must be between 0.0 and 4.0.";
    if (!data.city.trim()) errors.city = "City is required.";
    if (!data.state.trim()) errors.state = "State is required.";
    if (isNaN(data.latitude) || data.latitude < -90 || data.latitude > 90)
      errors.latitude = "Latitude must be between -90 and 90.";
    if (isNaN(data.longitude) || data.longitude < -180 || data.longitude > 180)
      errors.longitude = "Longitude must be between -180 and 180.";

    return errors;
  };

  const handleChange = (key: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setFormErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      graduation_year: student.graduation_year,
      phone_number: student.phone_number,
      gpa: student.gpa,
      city: student.city,
      state: student.state,
      latitude: student.latitude,
      longitude: student.longitude,
    });
    setFormErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateFormData(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      setStatusMessage({
        type: "error",
        text: "Please fix the validation errors.",
      });
      return;
    }

    try {
      if (editingStudent) {
        const updates: Partial<FormData> = {};
        fields.forEach(({ key }) => {
          if (formData[key] !== editingStudent[key]) {
            updates[key] = formData[key];
          }
        });

        if (Object.keys(updates).length > 0) {
          const res = await dispatch(
            updateStudent({ id: editingStudent.id, updates })
          );
          if (updateStudent.fulfilled.match(res)) {
            setStatusMessage({
              type: "success",
              text: "Student updated successfully.",
            });
          } else {
            setStatusMessage({
              type: "error",
              text: res.payload || "Failed to update student.",
            });
          }
        }
        setEditingStudent(null);
      } else {
        const res = await dispatch(createStudent(formData));
        if (createStudent.fulfilled.match(res)) {
          setStatusMessage({
            type: "success",
            text: "Student created successfully.",
          });
        } else {
          setStatusMessage({
            type: "error",
            text: res.payload || "Failed to create student.",
          });
        }
      }

      setFormData({
        name: "",
        email: "",
        graduation_year: 2025,
        phone_number: "",
        gpa: 0,
        city: "",
        state: "",
        latitude: 0,
        longitude: 0,
      });
      setFormErrors({});
    } catch {
      setStatusMessage({
        type: "error",
        text: "An unexpected error occurred.",
      });
    }

    setTimeout(() => setStatusMessage(null), 5000);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Student Management System</h1>
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        {fields.map(({ key, label, type, required }) => (
          <FormField
            key={key}
            id={key}
            label={label}
            type={type}
            value={formData[key]}
            required={required}
            error={formErrors[key]}
            onChange={(val) => handleChange(key, val)}
          />
        ))}
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          {editingStudent ? "Update Student" : "Add Student"}
        </button>
        {statusMessage && (
          <p
            className={`text-sm mt-2 ${
              statusMessage.type === "success"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {statusMessage.text}
          </p>
        )}
      </form>

      <ListNavbar />

      <div>
        <h2 className="text-xl font-semibold mb-4">Student List</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && studentList.length === 0 && (
          <p className="text-gray-500 italic">No students found.</p>
        )}
        <div className="grid gap-4">
          {studentList.map((student) => (
            <div
              key={student.id}
              className="border p-5 rounded-xl shadow-md bg-white hover:shadow-lg transition-shadow"
            >
              <h2 className="text-lg font-semibold text-gray-800">
                {student.name}
              </h2>
              <p className="text-sm text-gray-500 mb-2">
                Created: {new Date(student.created_at).toLocaleDateString()}
              </p>
              <div className="text-sm text-gray-700 space-y-1">
                <p>
                  <span className="font-medium">Email:</span> {student.email}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {student.phone_number}
                </p>
                <p>
                  <span className="font-medium">Graduation Year:</span>{" "}
                  {student.graduation_year}
                </p>
                <p>
                  <span className="font-medium">GPA:</span> {student.gpa}
                </p>
                <p>
                  <span className="font-medium">Location:</span> {student.city},{" "}
                  {student.state}
                </p>
                <p>
                  <span className="font-medium">Coordinates:</span>{" "}
                  {student.latitude}, {student.longitude}
                </p>
              </div>
              <button
                onClick={() => handleEdit(student)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md mt-2 hover:bg-indigo-700"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
