import { bouquetById, themeClass, toEmbedUrl } from "@/lib/gift";

type Props = {
  senderName: string;
  recipientName: string;
  message: string;
  bouquet: string;
  theme: string;
  occasion?: string;
  songUrl?: string | null;
  showSong?: boolean;
};

export function GiftCard({
  senderName,
  recipientName,
  message,
  bouquet,
  theme,
  occasion,
  songUrl,
  showSong = false,
}: Props) {
  const bq = bouquetById(bouquet);
  const embed = showSong ? toEmbedUrl(songUrl) : null;

  return (
    <article
      className={`animate-bloom relative overflow-hidden rounded-3xl border p-7 shadow-paper sm:p-10 ${themeClass(theme)}`}
    >
      <div className="gift-theme-glow" aria-hidden="true" />

      <div className="relative">
        {occasion ? (
          <p className="text-xs uppercase tracking-[0.3em] opacity-70">{occasion}</p>
        ) : null}

        <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
          Untuk {recipientName || "kamu"},
        </h2>

        <div className="mt-6 flex justify-center">
          <img
            src={bq.image}
            alt={bq.name}
            loading="lazy"
            width={1024}
            height={1024}
            className="animate-sway h-64 w-auto origin-bottom object-contain drop-shadow-xl sm:h-80"
          />
        </div>

        <p className="mt-4 text-center text-xs uppercase tracking-[0.25em] opacity-60">
          {bq.name}
        </p>

        <p className="mt-7 whitespace-pre-wrap text-lg leading-relaxed">
          {message || "Tulis pesanmu di sini…"}
        </p>

        <p className="mt-8 font-display text-2xl">— {senderName || "Seseorang"}</p>

        <p className="mt-6 text-xs opacity-60">
          {bq.blooms} · {bq.meaning}
        </p>

        {embed ? (
          <div className="mt-6 overflow-hidden rounded-2xl">
            <iframe
              src={embed}
              title="Lagu untukmu"
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
              className="h-40 w-full border-0"
            />
          </div>
        ) : null}
      </div>
    </article>
  );
}
