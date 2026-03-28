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
    <div className="flex items-center gap-4">
      <button
        onClick={() => onChange(Math.max(min, quantity - 1))}
        disabled={quantity <= min}
        className="cursor-pointer flex items-center justify-center bg-white"
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "2px solid #000",
          fontSize: 20,
          color: "#000",
          opacity: quantity <= min ? 0.3 : 1,
        }}
      >
        <span style={{ transform: "translateY(-1px)" }}>−</span>
      </button>
      <span
        className="font-barlow font-bold flex items-center justify-center underline decoration-2 underline-offset-4"
        style={{
          fontSize: 20,
          color: "var(--color-dark)",
          minWidth: 20
        }}
      >
        {quantity}
      </span>
      <button
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        className="cursor-pointer flex items-center justify-center bg-white"
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "2px solid #000",
          fontSize: 20,
          color: "#000",
          opacity: quantity >= max ? 0.3 : 1,
        }}
      >
        <span style={{ transform: "translateY(-1px)" }}>+</span>
      </button>
    </div>
  );
}
