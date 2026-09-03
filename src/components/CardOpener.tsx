import { themeClass, type OpenerId } from "@/lib/gift";

type Props = {
  opener: string;
  theme: string;
  occasion?: string;
  senderName: string;
  recipientName: string;
  onOpen: () => void;
};

const COPY: Record<OpenerId, { hint: string; cta: string }> = {
  envelope: { hint: "Ada surat yang menunggu dibuka", cta: "Buka suratnya" },
  giftbox: { hint: "Ada kado kecil untukmu", cta: "Buka kadonya" },
  curtain: { hint: "Kelopaknya siap menyingkap", cta: "Singkap kelopaknya" },
};

export function CardOpener({
  opener,
  theme,
  occasion,
  senderName,
  recipientName,
  onOpen,
}: Props) {
  const variant = (["envelope", "giftbox", "curtain"] as OpenerId[]).includes(
    opener as OpenerId,
  )
    ? (opener as OpenerId)
    : "envelope";
  const copy = COPY[variant];

  return (
    <section
      className={`relative overflow-hidden rounded-4xl border p-8 text-center shadow-bloom sm:p-12 ${themeClass(theme)}`}
    >
      <div className="gift-theme-glow" aria-hidden="true" />

      <div className="relative">
        <p className="text-xs uppercase tracking-[0.3em] opacity-70">
          {occasion || "Sebuah kejutan"}
        </p>

        <div className="mx-auto mt-8 flex h-44 w-full max-w-xs items-center justify-center">
          {variant === "envelope" ? (
            <div className="opener-envelope" aria-hidden="true">
              <span className="opener-envelope-flap" />
              <span className="opener-envelope-seal" />
            </div>
          ) : variant === "giftbox" ? (
            <div className="opener-box" aria-hidden="true">
              <span className="opener-box-lid" />
              <span className="opener-box-ribbon" />
            </div>
          ) : (
            <div className="opener-petals" aria-hidden="true">
              {Array.from({ length: 7 }).map((_, i) => (
                <span key={i} style={{ animationDelay: `${i * 0.35}s`, left: `${i * 14}%` }} />
              ))}
            </div>
          )}
        </div>

        <h1 className="mt-8 font-display text-4xl leading-tight sm:text-5xl">
          {senderName || "Seseorang"} mengirim bunga untuk {recipientName || "kamu"}
        </h1>
        <p className="mt-3 text-sm opacity-70">{copy.hint}</p>

        <button
          type="button"
          onClick={onOpen}
          className="mt-8 rounded-full bg-cream px-8 py-4 text-sm font-medium text-cream-foreground transition hover:opacity-90"
        >
          {copy.cta}
        </button>
      </div>
    </section>
  );
}
