import { flowerById, type ThemeId } from "@/lib/flowers";

type Props = {
  senderName: string;
  recipientName: string;
  message: string;
  flowers: string[];
  theme: ThemeId | string;
  occasion?: string;
};

const themeShell: Record<string, string> = {
  garden: "bg-card text-card-foreground border-border",
  letter: "bg-paper text-paper-foreground border-transparent",
  dusk: "bg-secondary text-secondary-foreground border-border",
};

export function GiftCard({
  senderName,
  recipientName,
  message,
  flowers,
  theme,
  occasion,
}: Props) {
  const picked = flowers.map(flowerById).filter(Boolean);

  return (
    <article
      className={`animate-bloom relative overflow-hidden rounded-3xl border p-8 shadow-paper sm:p-10 ${
        themeShell[theme] ?? themeShell["garden"]
      }`}
    >
      {occasion ? (
        <p className="text-xs uppercase tracking-[0.3em] opacity-70">{occasion}</p>
      ) : null}

      <h2 className="mt-3 text-4xl leading-tight sm:text-5xl">
        Untuk {recipientName || "kamu"},
      </h2>

      <div className="mt-8 flex min-h-56 flex-wrap items-end justify-center gap-2">
        {picked.length === 0 ? (
          <p className="text-sm opacity-60">Pilih bunga untuk merangkai buketnya.</p>
        ) : (
          picked.map((f, i) => (
            <img
              key={f!.id}
              src={f!.image}
              alt={f!.name}
              loading="lazy"
              width={640}
              height={896}
              className="animate-sway h-48 w-auto origin-bottom object-contain sm:h-60"
              style={{ animationDelay: `${i * 0.4}s` }}
            />
          ))
        )}
      </div>

      <p className="mt-8 whitespace-pre-wrap text-lg leading-relaxed">
        {message || "Tulis pesanmu di sini…"}
      </p>

      <p className="mt-8 font-display text-2xl">— {senderName || "Seseorang"}</p>

      {picked.length > 0 ? (
        <p className="mt-6 text-xs opacity-60">
          {picked.map((f) => `${f!.name}: ${f!.meaning}`).join(" · ")}
        </p>
      ) : null}
    </article>
  );
}
