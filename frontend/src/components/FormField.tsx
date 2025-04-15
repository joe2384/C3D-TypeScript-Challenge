type Props = {
  id: string;
  label: string;
  type: string;
  value: string | number;
  required?: boolean;
  error?: string;
  onChange: (val: string | number) => void;
};

const FormField = ({
  id,
  label,
  type,
  value,
  required,
  error,
  onChange,
}: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (type === "number") {
      if (val === "") {
        onChange("");
      } else if (!isNaN(Number(val))) {
        onChange(Number(val));
      }
    } else {
      onChange(val);
    }
  };

  return (
    <div className="mb-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value === 0 ? "" : value}
        onChange={handleChange}
        className={`mt-1 block w-full rounded-md border ${
          error ? "border-red-500" : "border-gray-300"
        } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
        required={required}
      />
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default FormField;
