"use client";

type MuteButtonProps = {
  muted: boolean;
  onToggle: () => void;
};

export default function MuteButton({ muted, onToggle }: MuteButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={muted ? "Unmute theme song" : "Mute theme song"}
      aria-pressed={muted}
      title={muted ? "Sound off" : "Sound on"}
      className="pointer-events-auto grid h-11 w-11 place-items-center border-3 border-ink bg-white shadow-brutal-sm transition-colors hover:bg-lime focus-visible:bg-lime"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true">
        <path
          d="M3.5 9h3.2L12 4.6v14.8L6.7 15H3.5z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        {muted ? (
          <path
            d="M16 9.5l5 5m0-5l-5 5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        ) : (
          <path
            d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9.5 9.5 0 0 1 0 13"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        )}
      </svg>
    </button>
  );
}
