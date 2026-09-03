import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { GiftCard } from "@/components/GiftCard";

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
    ],
  }),
  component: CardPage,
});

function CardPage() {
  const { id } = Route.useParams();
  const [opened, setOpened] = useState(false);

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

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Tautan kartu disalin!");
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
    <main className="mx-auto max-w-2xl px-6 py-12">
      {!opened ? (
        <div className="rounded-4xl border border-border bg-card/70 p-10 text-center shadow-bloom">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {data.occasion || "Sebuah kejutan"}
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl">
            {data.sender_name || "Seseorang"} mengirim bunga untuk{" "}
            {data.recipient_name || "kamu"}
          </h1>
          <button
            type="button"
            onClick={() => setOpened(true)}
            className="mt-8 rounded-full bg-cream px-8 py-4 text-sm font-medium text-cream-foreground transition hover:opacity-90"
          >
            Buka buketnya
          </button>
        </div>
      ) : (
        <>
          <GiftCard
            recipientName={data.recipient_name}
            senderName={data.sender_name}
            message={data.message}
            flowers={data.flowers ?? []}
            theme={data.theme}
            occasion={data.occasion}
          />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={copyLink}
              className="rounded-full border border-border px-6 py-3 text-sm transition hover:bg-secondary"
            >
              Salin tautan kartu
            </button>
            <Link
              to="/buat"
              className="rounded-full bg-cream px-6 py-3 text-sm text-cream-foreground transition hover:opacity-90"
            >
              Kirim balik kartu bunga
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
