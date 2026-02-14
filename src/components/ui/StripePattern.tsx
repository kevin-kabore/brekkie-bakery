interface StripePatternProps {
  color?: string;
  opacity?: number;
  className?: string;
}

export function StripePattern({
  color = "#F0C75E",
  opacity = 0.1,
  className = "",
}: StripePatternProps) {
  return (
    <svg
      className={`absolute inset-0 w-full h-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={`stripes-${color.replace("#", "")}`}
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-45)"
        >
          <rect width="8" height="20" fill={color} opacity={opacity} />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill={`url(#stripes-${color.replace("#", "")})`}
      />
    </svg>
  );
}
