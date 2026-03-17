import { type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, className = "", id, ...props }: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-medium text-espresso">
        {label}
        {props.required && <span className="text-crust ml-1">*</span>}
      </label>
      <input
        id={inputId}
        className={`rounded-lg border border-stone bg-white px-4 py-2.5 text-espresso placeholder:text-espresso/40 focus:border-crust focus:outline-none focus:ring-2 focus:ring-crust/20 transition-colors ${error ? "border-red-500" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
