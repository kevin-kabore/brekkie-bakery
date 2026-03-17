"use client";

interface QuantityStepperProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  max?: number;
  size?: "sm" | "md";
}

const sizeClasses = {
  sm: "h-8 w-8 text-sm",
  md: "h-11 w-11 text-base",
};

export function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
  max = 20,
  size = "md",
}: QuantityStepperProps) {
  const btn = sizeClasses[size];

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onDecrement}
        className={`${btn} flex items-center justify-center rounded-full border border-navy/20 text-navy hover:bg-navy/5 transition-colors cursor-pointer`}
        aria-label="Decrease quantity"
      >
        &minus;
      </button>
      <span className="w-8 text-center font-semibold text-navy tabular-nums">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        disabled={quantity >= max}
        className={`${btn} flex items-center justify-center rounded-full border border-navy/20 text-navy hover:bg-navy/5 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed`}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
