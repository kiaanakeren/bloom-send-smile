import { createFileRoute, Link } from "@tanstack/react-router";
import { FLOWERS } from "@/lib/flowers";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bloomly — Kirim Kartu Ucapan & Buket Bunga Digital" },
      {
        name: "description",
        content:
          "Rangkai buket bunga digital, tulis kartu ucapan, lalu kirim tautannya ke orang tersayang. Gratis, tanpa aplikasi.",
      },
      { property: "og:title", content: "Bloomly — Kartu Ucapan & Buket Bunga Digital" },
      {
        property: "og:description",
        content:
          "Pilih bunga, tulis pesan, bagikan tautan pribadi. Kartu digital yang bisa dibuka kapan saja.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <main>
      <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-16 pt-14 lg:grid-cols-2 lg:items-center lg:pt-24">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
            Bloomly · kartu ucapan digital
          </p>
          <h1 className="mt-6 text-5xl leading-[0.95] sm:text-7xl">
            Bunga yang tidak pernah layu.
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">
            Rangkai buket, tulis kartu ucapan, lalu kirim tautannya ke siapa pun. Penerima
            cukup membuka di browser — tanpa unduh aplikasi.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to="/buat"
              className="rounded-full bg-cream px-7 py-3.5 text-sm font-medium text-cream-foreground transition hover:opacity-90"
            >
              Buat kartu sekarang
            </Link>
            <a
              href="#bunga"
              className="rounded-full border border-border px-7 py-3.5 text-sm font-medium transition hover:bg-secondary"
            >
              Lihat pilihan bunga
            </a>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-4xl border border-border bg-card/60 p-8 shadow-bloom">
          <div className="flex items-end justify-center gap-1">
            {FLOWERS.slice(0, 4).map((f, i) => (
              <img
                key={f.id}
                src={f.image}
                alt={`Ilustrasi bunga ${f.name}`}
                width={640}
                height={896}
                className="animate-sway h-56 w-auto origin-bottom object-contain sm:h-72"
                style={{ animationDelay: `${i * 0.5}s` }}
              />
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Setiap buket punya tautan pribadi & bisa dibuka kapan saja.
          </p>
        </div>
      </section>

      <section id="bunga" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl sm:text-4xl">Pilih bunga sesuai maknanya</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FLOWERS.map((f) => (
            <div
              key={f.id}
              className="rounded-3xl border border-border bg-card p-6 text-card-foreground"
            >
              <img
                src={f.image}
                alt={`Bunga ${f.name}`}
                loading="lazy"
                width={640}
                height={896}
                className="mx-auto h-40 w-auto object-contain"
              />
              <h3 className="mt-4 text-2xl">{f.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.meaning}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl sm:text-4xl">Tiga langkah saja</h2>
        <ol className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            ["01", "Rangkai buket", "Pilih sampai tiga bunga favorit dan tema kartunya."],
            ["02", "Tulis ucapan", "Nama penerima, momennya, dan pesan dari hatimu."],
            ["03", "Kirim tautan", "Salin tautan lalu bagikan lewat WhatsApp atau chat apa pun."],
          ].map(([n, title, desc]) => (
            <li key={n} className="rounded-3xl border border-border bg-card/70 p-7">
              <span className="font-display text-3xl text-primary">{n}</span>
              <h3 className="mt-3 text-2xl">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </li>
          ))}
        </ol>
        <Link
          to="/buat"
          className="mt-10 inline-block rounded-full bg-cream px-7 py-3.5 text-sm font-medium text-cream-foreground transition hover:opacity-90"
        >
          Mulai rangkai buket
        </Link>
      </section>
    </main>
  );
}
