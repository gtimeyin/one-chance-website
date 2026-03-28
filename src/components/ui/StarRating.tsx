interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
}

export default function StarRating({ rating, maxRating = 5, size = 16 }: StarRatingProps) {
  return (
    <div className="flex items-center" style={{ gap: 2 }}>
      {Array.from({ length: maxRating }).map((_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={i < rating ? "#FCCD21" : "none"}
          stroke={i < rating ? "#FCCD21" : "#CFD1D0"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}
