import StarRating from "./StarRating";

interface TestimonialCardProps {
  name: string;
  rating: number;
  text: string;
}

export default function TestimonialCard({ name, rating, text }: TestimonialCardProps) {
  return (
    <div
      className="flex flex-col"
      style={{
        padding: "clamp(20px, 3vw, 32px)",
        border: "1px solid var(--color-border-light)",
        gap: 16,
      }}
    >
      <div className="flex items-center justify-between">
        <p className="font-barlow font-bold" style={{ fontSize: 16, color: "var(--color-dark)" }}>
          {name}
        </p>
        <StarRating rating={rating} size={14} />
      </div>
      <p className="font-barlow" style={{ fontSize: 14, color: "var(--color-text-muted)", lineHeight: 1.6 }}>
        {text}
      </p>
    </div>
  );
}
