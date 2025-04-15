export interface Student {
  id: number;
  name: string;
  email: string;
  graduation_year: number;
  phone_number: string;
  gpa: number;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  created_at: string;
  updated_at: string;
}

export interface StudentState {
  students: Student[];
  loading: boolean;
  error: string | null;
}