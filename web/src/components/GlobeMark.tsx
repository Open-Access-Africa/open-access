export function GlobeMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 34 34"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      aria-hidden="true"
      className={className}
    >
      <circle cx="17" cy="17" r="15" />
      <path d="M2 17h30M17 2c5 5 5 25 0 30M17 2c-5 5-5 25 0 30" />
    </svg>
  );
}
