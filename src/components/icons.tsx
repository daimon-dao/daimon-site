import type { ProofIconName } from "@/content/types";

/** Hand-drawn line icons for the proof cards. Gold stroke, no library. */
const paths: Record<ProofIconName, React.ReactNode> = {
  audit: (
    <>
      <path d="M6 3h9l5 5v13H6z" />
      <path d="M14 3v6h6" />
      <path d="m9 15 2 2 4-4" />
    </>
  ),
  frozen: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="1" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      <path d="M12 15v3" />
    </>
  ),
  rehearsed: (
    <>
      <path d="M20 12a8 8 0 1 1-2.3-5.7" />
      <path d="M20 4v5h-5" />
      <path d="m10 9 5 3-5 3z" />
    </>
  ),
  monitor: (
    <>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  contracts: (
    <>
      <path d="M8 4c-2 0-3 1-3 3v3c0 1-1 2-2 2 1 0 2 1 2 2v3c0 2 1 3 3 3" />
      <path d="M16 4c2 0 3 1 3 3v3c0 1 1 2 2 2-1 0-2 1-2 2v3c0 2-1 3-3 3" />
    </>
  ),
};

export function ProofIcon({ name, className }: { name: ProofIconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={32}
      height={32}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}
