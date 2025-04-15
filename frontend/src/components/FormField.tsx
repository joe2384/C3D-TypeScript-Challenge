import React from "react";

type Props = {
  id: string;
  label: string;
  type: string;
  value: string | number;
  required?: boolean;
  onChange: (val: string | number) => void;
};

const FormField = ({ id, label, type, value, required, onChange }: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (type === "number") {
      if (val === "") {
        onChange(""); // allow empty value for controlled input
      } else if (!isNaN(Number(val))) {
        onChange(Number(val));
      }
    } else {
      onChange(val);
    }
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value === 0 ? "" : value}
        onChange={handleChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        required={required}
      />
    </div>
  );
};

export default FormField;
