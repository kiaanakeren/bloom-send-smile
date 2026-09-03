import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import QRCode from "qrcode";
import { supabase } from "@/integrations/supabase/client";
import { GiftCard } from "@/components/GiftCard";
import { CardOpener } from "@/components/CardOpener";
import { PetalRain } from "@/components/PetalRain";

export const Route = createFileRoute("/kartu/$id")({
  head: () => ({
    meta: [
      { title: "Kartu Bunga Untukmu — Bloomly" },
      {
        name: "description",
        content: "Seseorang mengirimkan buket bunga digital dan kartu ucapan untukmu.",
      },
      { property: "og:title", content: "Ada kartu bunga untukmu" },
      {
        property: "og:description",
        content: "Buka buket bunga digital dan pesan spesial yang dikirim untukmu.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CardPage,
});

function CardPage() {
  const { id } = Route.useParams();
  const [opened, setOpened] = useState(false);
  const [qr, setQr] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["card", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    QRCode.toDataURL(window.location.href, { margin: 1, width: 320 })
      .then(setQr)
      .catch(() => setQr(null));
  }, [id]);

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Tautan kartu disalin!");
  }

  async function shareLink() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Ada bunga untukmu", url });
        return;
      } catch {
        /* dibatalkan */
      }
    }
    copyLink();
  }

  if (isLoading) {
    return <main className="p-16 text-center text-muted-foreground">Merangkai buket…</main>;
  }

  if (isError || !data) {
    return (
      <main className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="text-4xl">Kartu tidak ditemukan</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Tautannya mungkin salah atau sudah tidak berlaku.
        </p>
        <Link
          to="/buat"
          className="mt-8 inline-block rounded-full bg-cream px-6 py-3 text-sm text-cream-foreground"
        >
          Buat kartu sendiri
        </Link>
      </main>
    );
  }

  return (
    <main className="relative mx-auto max-w-2xl px-5 py-10 sm:px-6">
      {opened ? <PetalRain /> : null}

      {!opened ? (
        <CardOpener
          opener={data.opener ?? "envelope"}
          theme={data.theme}
          occasion={data.occasion ?? undefined}
          senderName={data.sender_name ?? ""}
          recipientName={data.recipient_name ?? ""}
          onOpen={() => setOpened(true)}
        />
      ) : (
        <>
          <GiftCard
            recipientName={data.recipient_name ?? ""}
            senderName={data.sender_name ?? ""}
            message={data.message ?? ""}
            bouquet={data.bouquet ?? "rose"}
            theme={data.theme}
            occasion={data.occasion ?? undefined}
            songUrl={data.song_url}
            showSong
          />

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={shareLink}
              className="rounded-full bg-cream px-6 py-3 text-sm text-cream-foreground"
            >
              Bagikan kartu
            </button>
            <button
              type="button"
              onClick={copyLink}
              className="rounded-full border border-border px-6 py-3 text-sm"
            >
              Salin tautan
            </button>
            <Link
              to="/buat"
              className="rounded-full border border-border px-6 py-3 text-sm"
            >
              Kirim balasan
            </Link>
          </div>

          {qr ? (
            <div className="mt-10 flex flex-col items-center gap-3 rounded-3xl border border-border bg-card/60 p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                QR kartu ini
              </p>
              <img
                src={qr}
                alt="Kode QR menuju kartu ini"
                loading="lazy"
                width={320}
                height={320}
                className="h-40 w-40 rounded-2xl bg-paper p-2"
              />
              <a
                href={qr}
                download="kartu-bloomly.png"
                className="text-xs underline opacity-80"
              >
                Unduh QR
              </a>
            </div>
          ) : null}
        </>
      )}
    </main>
  );
}
