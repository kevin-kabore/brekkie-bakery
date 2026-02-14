import { type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, className = "", id, ...props }: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-medium text-navy">
        {label}
        {props.required && <span className="text-coral ml-1">*</span>}
      </label>
      <input
        id={inputId}
        className={`rounded-lg border border-navy/20 bg-white px-4 py-2.5 text-navy placeholder:text-navy/40 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20 transition-colors ${error ? "border-red-500" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
