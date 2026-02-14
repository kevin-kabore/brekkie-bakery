import { type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function Textarea({
  label,
  error,
  className = "",
  id,
  ...props
}: TextareaProps) {
  const textareaId = id || label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={textareaId} className="text-sm font-medium text-navy">
        {label}
        {props.required && <span className="text-coral ml-1">*</span>}
      </label>
      <textarea
        id={textareaId}
        rows={3}
        className={`rounded-lg border border-navy/20 bg-white px-4 py-2.5 text-navy placeholder:text-navy/40 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20 transition-colors resize-y ${error ? "border-red-500" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
