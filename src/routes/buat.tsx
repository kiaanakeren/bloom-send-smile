import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  BOUQUETS,
  OCCASIONS,
  OPENERS,
  THEMES,
  toEmbedUrl,
  type OpenerId,
  type ThemeId,
} from "@/lib/gift";
import { GiftCard } from "@/components/GiftCard";
import { CardOpener } from "@/components/CardOpener";

export const Route = createFileRoute("/buat")({
  head: () => ({
    meta: [
      { title: "Buat Kartu Bunga Digital — Bloomly" },
      {
        name: "description",
        content:
          "Pilih buket bunga, tema kartu, animasi pembuka, tulis pesan, lalu kirim tautan kartu ucapan digital.",
      },
      { property: "og:title", content: "Buat Kartu Bunga Digital — Bloomly" },
      {
        property: "og:description",
        content: "Pilih buket, tema, dan pembuka kejutan, lalu kirim tautannya.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Compose,
});

type Step = 1 | 2 | 3;

function Compose() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");
  const [occasion, setOccasion] = useState(OCCASIONS[0]!);
  const [theme, setTheme] = useState<ThemeId>("garden");
  const [opener, setOpener] = useState<OpenerId>("envelope");
  const [bouquet, setBouquet] = useState(BOUQUETS[0]!.id);
  const [songUrl, setSongUrl] = useState("");
  const [previewOpened, setPreviewOpened] = useState(true);
  const [saving, setSaving] = useState(false);

  async function handleSend() {
    if (!recipientName.trim() || !message.trim()) {
      toast.error("Isi nama penerima dan pesannya dulu ya.");
      return;
    }
    if (songUrl.trim() && !toEmbedUrl(songUrl)) {
      toast.error("Tautan lagu harus dari Spotify atau YouTube.");
      return;
    }
    setSaving(true);
    const { data, error } = await supabase
      .from("cards")
      .insert({
        recipient_name: recipientName.trim(),
        sender_name: senderName.trim(),
        message: message.trim(),
        bouquet,
        theme,
        opener,
        occasion,
        song_url: songUrl.trim() || null,
        flowers: [bouquet],
      })
      .select("id")
      .single();
    setSaving(false);

    if (error || !data) {
      toast.error("Gagal menyimpan kartu. Coba lagi ya.");
      return;
    }
    navigate({ to: "/kartu/$id", params: { id: data.id } });
  }

  const inputClass =
    "mt-2 w-full rounded-2xl border border-border bg-input/40 px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary";
  const chip = (active: boolean) =>
    `rounded-full border px-4 py-2 text-xs transition ${
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border hover:bg-secondary"
    }`;

  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-5 py-10 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <h1 className="text-4xl sm:text-5xl">Rangkai kadonya</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Tiga langkah: pilih buket, atur pembuka & tema, lalu tulis pesannya.
        </p>

        <div className="mt-6 flex gap-2">
          {([1, 2, 3] as Step[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStep(s)}
              className={`flex-1 rounded-full border px-3 py-2 text-xs transition ${
                step === s ? "border-primary bg-secondary" : "border-border opacity-70"
              }`}
            >
              {s}. {s === 1 ? "Buket" : s === 2 ? "Suasana" : "Pesan"}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-7 rounded-3xl border border-border bg-card/70 p-5 sm:p-6">
          {step === 1 ? (
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Pilih buket
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {BOUQUETS.map((b) => {
                  const active = bouquet === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBouquet(b.id)}
                      className={`rounded-2xl border p-3 text-center transition ${
                        active
                          ? "border-primary bg-secondary"
                          : "border-border hover:bg-secondary/60"
                      }`}
                    >
                      <img
                        src={b.image}
                        alt={b.name}
                        loading="lazy"
                        width={1024}
                        height={1024}
                        className="mx-auto h-24 w-auto object-contain"
                      />
                      <span className="mt-2 block text-xs leading-tight">{b.name}</span>
                      <span className="mt-1 block text-[10px] opacity-60">{b.meaning}</span>
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="mt-6 w-full rounded-full bg-cream px-6 py-3 text-sm text-cream-foreground"
              >
                Lanjut ke suasana
              </button>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-7">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Animasi pembuka
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {OPENERS.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => {
                        setOpener(o.id);
                        setPreviewOpened(false);
                      }}
                      className={`rounded-2xl border p-3 text-left transition ${
                        opener === o.id
                          ? "border-primary bg-secondary"
                          : "border-border hover:bg-secondary/60"
                      }`}
                    >
                      <span className="block text-sm">{o.name}</span>
                      <span className="mt-1 block text-[11px] opacity-60">{o.note}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Tema kartu
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTheme(t.id)}
                      className={chip(theme === t.id)}
                      title={t.note}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Momen</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {OCCASIONS.map((o) => (
                    <button
                      key={o}
                      type="button"
                      onClick={() => setOccasion(o)}
                      className={chip(occasion === o)}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-full rounded-full bg-cream px-6 py-3 text-sm text-cream-foreground"
              >
                Lanjut ke pesan
              </button>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-6">
              <label className="block text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Untuk siapa
                <input
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Nama penerima"
                  className={inputClass}
                />
              </label>

              <label className="block text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Dari
                <input
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Namamu"
                  className={inputClass}
                />
              </label>

              <label className="block text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Pesan
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder="Tulis ucapanmu…"
                  className={`${inputClass} resize-none`}
                />
              </label>

              <label className="block text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Lagu (opsional)
                <input
                  value={songUrl}
                  onChange={(e) => setSongUrl(e.target.value)}
                  placeholder="Tautan Spotify atau YouTube"
                  className={inputClass}
                />
              </label>

              <button
                type="button"
                onClick={handleSend}
                disabled={saving}
                className="w-full rounded-full bg-cream px-6 py-4 text-sm font-medium text-cream-foreground transition hover:opacity-90 disabled:opacity-60"
              >
                {saving ? "Menyiapkan buket…" : "Buat tautan kartu"}
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="lg:sticky lg:top-8 lg:self-start">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Pratinjau</p>
          <button
            type="button"
            onClick={() => setPreviewOpened((v) => !v)}
            className="rounded-full border border-border px-3 py-1 text-[11px]"
          >
            {previewOpened ? "Lihat pembuka" : "Lihat kartu"}
          </button>
        </div>

        {previewOpened ? (
          <GiftCard
            recipientName={recipientName}
            senderName={senderName}
            message={message}
            bouquet={bouquet}
            theme={theme}
            occasion={occasion}
          />
        ) : (
          <CardOpener
            opener={opener}
            theme={theme}
            occasion={occasion}
            senderName={senderName}
            recipientName={recipientName}
            onOpen={() => setPreviewOpened(true)}
          />
        )}
      </div>
    </main>
  );
}
