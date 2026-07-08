import Image from "next/image";

export function Logo({
  className = "",
  imageWidth = 160,
  showTagline = false,
}: {
  className?: string;
  imageWidth?: number;
  showTagline?: boolean;
}) {
  return (
    <div
      className={`inline-flex flex-col items-center rounded-xl bg-white px-6 py-4 ${className}`}
    >
      <Image
        src="/sobha-logo.png"
        alt="Sobha"
        width={312}
        height={196}
        style={{ width: imageWidth, height: "auto" }}
        priority
      />
      {showTagline && (
        <span className="mt-1 text-[10px] font-medium tracking-[0.25em] text-black/50">
          DEVOTION AT WORK
        </span>
      )}
    </div>
  );
}
