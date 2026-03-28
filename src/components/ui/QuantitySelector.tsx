"use client";

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
}

export default function QuantitySelector({
  quantity,
  onChange,
  min = 1,
  max = 99,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center" style={{ border: "1px solid var(--color-border-light)" }}>
      <button
        onClick={() => onChange(Math.max(min, quantity - 1))}
        disabled={quantity <= min}
        className="cursor-pointer font-barlow font-bold flex items-center justify-center bg-white border-none"
        style={{
          width: 40,
          height: 40,
          fontSize: 18,
          color: quantity <= min ? "var(--color-border-light)" : "var(--color-dark)",
        }}
      >
        -
      </button>
      <span
        className="font-barlow font-semibold flex items-center justify-center"
        style={{
          width: 48,
          height: 40,
          fontSize: 16,
          color: "var(--color-dark)",
          borderLeft: "1px solid var(--color-border-light)",
          borderRight: "1px solid var(--color-border-light)",
        }}
      >
        {quantity}
      </span>
      <button
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        className="cursor-pointer font-barlow font-bold flex items-center justify-center bg-white border-none"
        style={{
          width: 40,
          height: 40,
          fontSize: 18,
          color: quantity >= max ? "var(--color-border-light)" : "var(--color-dark)",
        }}
      >
        +
      </button>
    </div>
  );
}
