import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { FLOWERS, OCCASIONS, THEMES, type ThemeId } from "@/lib/flowers";
import { GiftCard } from "@/components/GiftCard";

export const Route = createFileRoute("/buat")({
  head: () => ({
    meta: [
      { title: "Buat Kartu Ucapan Bunga — Bloomly" },
      {
        name: "description",
        content:
          "Rangkai buket bunga digital, pilih tema, tulis pesan, dan dapatkan tautan kartu untuk dikirim.",
      },
      { property: "og:title", content: "Buat Kartu Ucapan Bunga — Bloomly" },
      {
        property: "og:description",
        content: "Pilih bunga, tulis ucapan, kirim tautan kartunya ke orang tersayang.",
      },
    ],
  }),
  component: Compose,
});

const MAX_FLOWERS = 3;

function Compose() {
  const navigate = useNavigate();
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");
  const [occasion, setOccasion] = useState(OCCASIONS[0]!);
  const [theme, setTheme] = useState<ThemeId>("garden");
  const [flowers, setFlowers] = useState<string[]>(["rose"]);
  const [saving, setSaving] = useState(false);

  function toggleFlower(id: string) {
    setFlowers((prev) => {
      if (prev.includes(id)) return prev.filter((f) => f !== id);
      if (prev.length >= MAX_FLOWERS) {
        toast.error(`Maksimal ${MAX_FLOWERS} bunga per buket`);
        return prev;
      }
      return [...prev, id];
    });
  }

  async function handleSend() {
    if (!recipientName.trim() || !message.trim() || flowers.length === 0) {
      toast.error("Isi nama penerima, pesan, dan minimal satu bunga.");
      return;
    }
    setSaving(true);
    const { data, error } = await supabase
      .from("cards")
      .insert({
        recipient_name: recipientName.trim(),
        sender_name: senderName.trim(),
        message: message.trim(),
        flowers,
        theme,
        occasion,
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

  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <h1 className="text-4xl sm:text-5xl">Rangkai kartunya</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Semua perubahan langsung terlihat di pratinjau.
        </p>

        <div className="mt-8 space-y-6 rounded-3xl border border-border bg-card/70 p-6">
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Untuk siapa
              <input
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Nama penerima"
                className={inputClass}
              />
            </label>
          </div>

          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Dari
              <input
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Namamu"
                className={inputClass}
              />
            </label>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Momen</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {OCCASIONS.map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => setOccasion(o)}
                  className={`rounded-full border px-4 py-2 text-xs transition ${
                    occasion === o
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:bg-secondary"
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Pesan
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Tulis ucapanmu…"
                className={`${inputClass} resize-none`}
              />
            </label>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Pilih bunga (maks {MAX_FLOWERS})
            </p>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {FLOWERS.map((f) => {
                const active = flowers.includes(f.id);
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => toggleFlower(f.id)}
                    className={`rounded-2xl border p-3 text-center transition ${
                      active
                        ? "border-primary bg-secondary"
                        : "border-border hover:bg-secondary/60"
                    }`}
                  >
                    <img
                      src={f.image}
                      alt={f.name}
                      loading="lazy"
                      width={640}
                      height={896}
                      className="mx-auto h-20 w-auto object-contain"
                    />
                    <span className="mt-2 block text-xs">{f.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Tema kartu</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  className={`rounded-full border px-4 py-2 text-xs transition ${
                    theme === t.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:bg-secondary"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSend}
            disabled={saving}
            className="w-full rounded-full bg-cream px-6 py-4 text-sm font-medium text-cream-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Menyiapkan buket…" : "Buat tautan kartu"}
          </button>
        </div>
      </div>

      <div className="lg:sticky lg:top-8 lg:self-start">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">Pratinjau</p>
        <GiftCard
          recipientName={recipientName}
          senderName={senderName}
          message={message}
          flowers={flowers}
          theme={theme}
          occasion={occasion}
        />
      </div>
    </main>
  );
}
