const PETAL = "M0,0 C-22,-30 -17,-65 0,-85 C17,-65 22,-30 0,0 Z";

export function LotusMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <g transform="translate(100,130)">
        <g transform="rotate(-60) scale(1.05)">
          <path d={PETAL} />
        </g>
        <g transform="rotate(60) scale(1.05)">
          <path d={PETAL} />
        </g>
        <g transform="rotate(-32) scale(1.3)">
          <path d={PETAL} />
        </g>
        <g transform="rotate(32) scale(1.3)">
          <path d={PETAL} />
        </g>
        <g transform="rotate(-12) scale(0.72)">
          <path d={PETAL} />
        </g>
        <g transform="rotate(12) scale(0.72)">
          <path d={PETAL} />
        </g>
        <path d="M-8,0 C-18,20 -10,45 0,60 C10,45 18,20 8,0 Z" />
      </g>
    </svg>
  );
}

export function Logo({
  className = "",
  iconClassName = "h-9 w-9",
  showTagline = false,
}: {
  className?: string;
  iconClassName?: string;
  showTagline?: boolean;
}) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <LotusMark className={iconClassName} />
      <span className="mt-1 font-serif text-xl font-semibold tracking-[0.3em]">
        SOBHA
      </span>
      {showTagline && (
        <span className="mt-0.5 text-[10px] font-medium tracking-[0.25em] text-black/50 dark:text-white/50">
          DEVOTION AT WORK
        </span>
      )}
    </div>
  );
}
