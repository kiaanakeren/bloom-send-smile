export function PetalRain({ count = 18 }: { count?: number }) {
  return (
    <div className="petal-rain" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          style={{
            left: `${(i * 100) / count + (i % 3) * 2}%`,
            animationDelay: `${(i % 6) * 1.1}s`,
            animationDuration: `${7 + (i % 5) * 1.6}s`,
          }}
        />
      ))}
    </div>
  );
}
