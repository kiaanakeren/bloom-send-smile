CREATE TABLE public.cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_name TEXT NOT NULL DEFAULT '',
  recipient_name TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL DEFAULT '',
  flowers TEXT[] NOT NULL DEFAULT '{}',
  theme TEXT NOT NULL DEFAULT 'garden',
  occasion TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.cards TO anon;
GRANT SELECT, INSERT ON public.cards TO authenticated;
GRANT ALL ON public.cards TO service_role;

ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create a card" ON public.cards FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone with the link can read a card" ON public.cards FOR SELECT TO anon, authenticated USING (true);