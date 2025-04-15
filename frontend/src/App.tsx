import { AppDispatch, RootState } from "./store/store";
import { createStudent, fetchStudents } from "./store/students/studentSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import FormField from "./components/FormField";

const fields = [
  { key: "name", label: "Student Name", type: "text", required: true },
  { key: "email", label: "Email Address", type: "email", required: true },
  { key: "graduation_year", label: "Graduation Year", type: "number" },
  { key: "phone_number", label: "Phone Number", type: "text" },
  { key: "gpa", label: "GPA", type: "number" },
  { key: "city", label: "City", type: "text" },
  { key: "state", label: "State", type: "text" },
  { key: "latitude", label: "Latitude", type: "number" },
  { key: "longitude", label: "Longitude", type: "number" },
];

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { students, loading, error } = useSelector(
    (state: RootState) => state.students
  );

  const [formData, setFormData] = useState({
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

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  const handleChange = (key: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(createStudent(formData));
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
            value={formData[key as keyof typeof formData]}
            required={required}
            onChange={(val) => handleChange(key, val)}
          />
        ))}
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Add Student
        </button>
      </form>

      <div>
        <h2 className="text-xl font-semibold mb-4">Student List</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid gap-4">
          {students?.map((student) => (
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
