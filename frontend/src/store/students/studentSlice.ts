import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Student, StudentState } from "../../types/student";
import { restCall } from "../../utils/api/restCall";

const initialState: StudentState = {
  students: [],
  loading: false,
  error: null,
};

export const fetchStudents = createAsyncThunk<
  Student[],
  void,
  { rejectValue: string }
>("students/fetchStudents", async (_, thunkAPI) => {
  const { data, error } = await restCall<Student[]>({ url: "/api/students" });
  if (!data || error) {
    return thunkAPI.rejectWithValue(error || "Failed to fetch students");
  }
  return data;
});

export const fetchStudentsWithParams = createAsyncThunk<
  Student[],
  Record<string, string>,
  { rejectValue: string }
>("students/fetchStudentsWithParams", async (params, thunkAPI) => {
  const query = new URLSearchParams(params).toString();
  const url = `/api/students?${query}`;
  const { data, error } = await restCall<Student[]>({ url });
  if (!data || error) {
    return thunkAPI.rejectWithValue(error || "Failed to fetch students");
  }
  return data;
});

export const createStudent = createAsyncThunk<
  Student,
  Partial<Student>,
  { rejectValue: string }
>("students/createStudent", async (student, thunkAPI) => {
  const { data, error } = await restCall<Student>({
    url: "/api/students",
    method: "POST",
    data: student,
  });
  if (!data || error) {
    return thunkAPI.rejectWithValue(error || "Failed to create student");
  }
  return data;
});

export const updateStudent = createAsyncThunk<
  Student,
  { id: number; updates: Partial<Student> },
  { rejectValue: string }
>("students/updateStudent", async ({ id, updates }, thunkAPI) => {
  const { data, error } = await restCall<Student>({
    url: `/api/students/${id}`,
    method: "PATCH",
    data: updates,
  });
  if (!data || error) {
    return thunkAPI.rejectWithValue(error || "Failed to update student");
  }
  return data;
});

const studentSlice = createSlice({
  name: "students",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action: PayloadAction<Student[]>) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch students";
      })
      .addCase(fetchStudentsWithParams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentsWithParams.fulfilled, (state, action: PayloadAction<Student[]>) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudentsWithParams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch students";
      })
      .addCase(createStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStudent.fulfilled, (state, action: PayloadAction<Student>) => {
        state.loading = false;
        state.students.push(action.payload);
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create student";
      })
      .addCase(updateStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudent.fulfilled, (state, action: PayloadAction<Student>) => {
        state.loading = false;
        const index = state.students.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.students[index] = action.payload;
        }
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update student";
      });
  },
});

export default studentSlice.reducer;