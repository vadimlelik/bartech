const PATHS = {
  truck: (
    <>
      <path d="M3 7h11v8H3z" />
      <path d="M14 10h4l3 3v2h-7z" />
      <circle cx="7" cy="17.5" r="1.5" />
      <circle cx="17" cy="17.5" r="1.5" />
    </>
  ),
  shield: (
    <path d="M12 3 5 6v6c0 4.2 2.8 7.2 7 8.5 4.2-1.3 7-4.3 7-8.5V6l-7-3z" />
  ),
  card: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 12a8 8 0 0 1-13.7 5.7" />
      <path d="M4 12a8 8 0 0 1 13.7-5.7" />
      <path d="M16 6h4V2" />
      <path d="M8 18H4v4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v5l3 2" />
    </>
  ),
  check: <path d="M5 12.5 9.2 17 19 7" />,
  star: <path d="m12 3.5 2.4 5.1 5.6.7-4.1 3.8 1.1 5.5L12 16.8 6.9 18.6l1.1-5.5L4 9.3l5.6-.7L12 3.5z" />,
  image: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="m8 15 2.5-2.5L14 16" />
      <circle cx="9" cy="9" r="1" />
    </>
  ),
  chevronLeft: <path d="M14 6 8 12l6 6" />,
  chevronRight: <path d="m10 6 6 6-6 6" />,
};

/**
 * @param {{ name: keyof typeof PATHS, className?: string }} props
 */
export default function LandingIcon({ name, className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {PATHS[name] || PATHS.check}
    </svg>
  );
}

/**
 * @param {{ value: number, className?: string, iconClassName?: string, dimClassName?: string }} props
 */
export function StarRow({ value, className, iconClassName, dimClassName }) {
  const score = Math.min(5, Math.max(0, Math.round(Number(value) || 0)));
  return (
    <span className={className} role="img" aria-label={`Оценка ${score} из 5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <LandingIcon
          key={index}
          name="star"
          className={index < score ? iconClassName : dimClassName}
        />
      ))}
    </span>
  );
}
