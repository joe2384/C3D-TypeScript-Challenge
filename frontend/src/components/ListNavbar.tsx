import { AppDispatch, RootState } from "../store/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchStudentsWithParams } from "../store/students/studentSlice";

const ListNavbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { students } = useSelector((state: RootState) => state.students);
  const [initialStates, setInitialStates] = useState<string[]>([]);
  const [initialCities, setInitialCities] = useState<string[]>([]);
  const [initialYears, setInitialYears] = useState<string[]>([]);

  useEffect(() => {
    if (students.length > 0 && initialStates.length === 0) {
      const statesSet = new Set<string>();
      const citiesSet = new Set<string>();
      const yearsSet = new Set<number>();
      students.forEach((s) => {
        if (s.state) statesSet.add(s.state);
        if (s.city) citiesSet.add(s.city);
        if (s.graduation_year) yearsSet.add(s.graduation_year);
      });
      setInitialStates(Array.from(statesSet).sort());
      setInitialCities(Array.from(citiesSet).sort());
      setInitialYears(
        Array.from(yearsSet)
          .sort((a, b) => a - b)
          .map(String)
      );
    }
  }, [students, initialStates.length]);

  const [filters, setFilters] = useState({
    search: "",
    minGpa: "",
    maxGpa: "",
    graduationYear: "",
    city: "",
    state: "",
    sortBy: "name",
    sortOrder: "asc",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams: Record<string, string> = {};
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== "") queryParams[key] = val;
    });
    dispatch(fetchStudentsWithParams(queryParams));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6"
    >
      <input
        name="search"
        placeholder="Search by name, city, or state..."
        className="input"
        value={filters.search}
        onChange={handleChange}
      />
      <input
        name="minGpa"
        placeholder="Min GPA"
        type="number"
        className="input"
        value={filters.minGpa}
        onChange={handleChange}
      />
      <input
        name="maxGpa"
        placeholder="Max GPA"
        type="number"
        className="input"
        value={filters.maxGpa}
        onChange={handleChange}
      />
      <select
        name="graduationYear"
        value={filters.graduationYear}
        className="input"
        onChange={handleChange}
      >
        <option value="">All Years</option>
        {initialYears.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <select
        name="city"
        value={filters.city}
        className="input"
        onChange={handleChange}
      >
        <option value="">All Cities</option>
        {initialCities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
      <select
        name="state"
        value={filters.state}
        className="input"
        onChange={handleChange}
      >
        <option value="">All States</option>
        {initialStates.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>
      <select
        name="sortBy"
        value={filters.sortBy}
        className="input"
        onChange={handleChange}
      >
        <option value="name">Name</option>
        <option value="gpa">GPA</option>
        <option value="graduation_year">Graduation Year</option>
        <option value="city">City</option>
        <option value="state">State</option>
      </select>
      <select
        name="sortOrder"
        value={filters.sortOrder}
        className="input"
        onChange={handleChange}
      >
        <option value="asc">Asc</option>
        <option value="desc">Desc</option>
      </select>
      <button
        type="submit"
        className="col-span-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
      >
        Filter Students
      </button>
    </form>
  );
};

export default ListNavbar;
