import { type SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
}

export function Select({
  label,
  options,
  error,
  className = "",
  id,
  ...props
}: SelectProps) {
  const selectId = id || label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={selectId} className="text-sm font-medium text-navy">
        {label}
        {props.required && <span className="text-coral ml-1">*</span>}
      </label>
      <select
        id={selectId}
        className={`rounded-lg border border-navy/20 bg-white px-4 py-2.5 text-navy focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20 transition-colors ${error ? "border-red-500" : ""} ${className}`}
        {...props}
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
