import type { NoticeContent } from "@/lib/recruitment-notice";

export function CapacityNote({ notice }: { notice: NoticeContent }) {
  const [lastOutro, ...restReversed] = [...notice.outro].reverse();
  const outro = restReversed.reverse();
  return (
    <div className="mt-6 border-l-4 border-accent bg-paper/60 p-4 text-sm leading-relaxed text-ink space-y-2">
      <p className="font-semibold text-ink">{notice.title}</p>
      <p>{notice.intro}</p>
      {notice.spots.length > 0 && (
        <ul className="list-disc pl-5 space-y-1">
          {notice.spots.map((spot) => (
            <li key={spot.label}>
              {spot.label}: {spot.text}
            </li>
          ))}
        </ul>
      )}
      {outro.map((p) => (
        <p key={p}>{p}</p>
      ))}
      {lastOutro && (
        <p className={outro.length > 0 ? "text-ink-muted" : undefined}>{lastOutro}</p>
      )}
    </div>
  );
}
