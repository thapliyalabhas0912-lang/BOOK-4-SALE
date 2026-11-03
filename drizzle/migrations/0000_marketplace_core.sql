
-- shared updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- PROFILES (public seller info only; no email/phone)
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '' CHECK (char_length(full_name) <= 100),
  avatar_url text,
  city text CHECK (char_length(city) <= 80),
  about text CHECK (char_length(about) <= 1000),
  prep_background text CHECK (char_length(prep_background) <= 500),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are public" ON public.profiles FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE TRIGGER profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, city)
  VALUES (NEW.id,
    left(coalesce(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''), 100),
    left(NEW.raw_user_meta_data->>'city', 80))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- BOOKS (catalog info)
CREATE TABLE public.books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(title) BETWEEN 2 AND 200),
  author text NOT NULL CHECK (char_length(author) BETWEEN 1 AND 150),
  publisher text CHECK (char_length(publisher) <= 150),
  isbn text CHECK (isbn ~ '^[0-9Xx-]{10,17}$'),
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX books_title_idx ON public.books (lower(title));
CREATE INDEX books_isbn_idx ON public.books (isbn);
GRANT SELECT ON public.books TO anon;
GRANT SELECT, INSERT, UPDATE ON public.books TO authenticated;
GRANT ALL ON public.books TO service_role;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Books are public" ON public.books FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Users add books" ON public.books FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Creators edit books" ON public.books FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);

-- LISTINGS
CREATE TYPE public.listing_status AS ENUM ('active','paused','sold');
CREATE TABLE public.listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  book_id uuid NOT NULL REFERENCES public.books(id) ON DELETE RESTRICT,
  category text NOT NULL CHECK (category IN ('NCERT','JEE','NEET','UPSC','SSC','Banking','College','Other')),
  subject text CHECK (char_length(subject) <= 80),
  exam text CHECK (char_length(exam) <= 80),
  class_level text CHECK (char_length(class_level) <= 80),
  mrp numeric(10,2) NOT NULL CHECK (mrp > 0 AND mrp <= 100000),
  price numeric(10,2) NOT NULL CHECK (price > 0 AND price <= mrp),
  condition smallint NOT NULL CHECK (condition BETWEEN 1 AND 5),
  purchase_year smallint CHECK (purchase_year BETWEEN 1950 AND 2100),
  description text CHECK (char_length(description) <= 2000),
  prep_exam text CHECK (char_length(prep_exam) <= 80),
  prep_year smallint CHECK (prep_year BETWEEN 1950 AND 2100),
  city text NOT NULL CHECK (char_length(city) BETWEEN 2 AND 80),
  pincode text CHECK (pincode ~ '^[1-9][0-9]{5}$'),
  status public.listing_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX listings_status_created_idx ON public.listings (status, created_at DESC);
CREATE INDEX listings_seller_idx ON public.listings (seller_id);
CREATE INDEX listings_category_idx ON public.listings (category);
GRANT SELECT ON public.listings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.listings TO authenticated;
GRANT ALL ON public.listings TO service_role;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public sees active or sold listings" ON public.listings FOR SELECT TO anon, authenticated USING (status IN ('active','sold'));
CREATE POLICY "Sellers see own listings" ON public.listings FOR SELECT TO authenticated USING (auth.uid() = seller_id);
CREATE POLICY "Sellers create listings" ON public.listings FOR INSERT TO authenticated WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers update own listings" ON public.listings FOR UPDATE TO authenticated USING (auth.uid() = seller_id) WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers delete own listings" ON public.listings FOR DELETE TO authenticated USING (auth.uid() = seller_id);
CREATE TRIGGER listings_updated BEFORE UPDATE ON public.listings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- LISTING IMAGES
CREATE TABLE public.listing_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  url text NOT NULL,
  storage_path text NOT NULL,
  position smallint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX listing_images_listing_idx ON public.listing_images (listing_id, position);
GRANT SELECT ON public.listing_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.listing_images TO authenticated;
GRANT ALL ON public.listing_images TO service_role;
ALTER TABLE public.listing_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Images visible with listing" ON public.listing_images FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.listings l WHERE l.id = listing_id));
CREATE POLICY "Sellers manage own images" ON public.listing_images FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.listings l WHERE l.id = listing_id AND l.seller_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.listings l WHERE l.id = listing_id AND l.seller_id = auth.uid())
    AND storage_path LIKE auth.uid()::text || '/%');

-- ADDRESSES (private)
CREATE TABLE public.addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name text NOT NULL CHECK (char_length(full_name) <= 100),
  phone text NOT NULL CHECK (phone ~ '^[0-9+ -]{7,15}$'),
  line1 text NOT NULL CHECK (char_length(line1) <= 200),
  line2 text CHECK (char_length(line2) <= 200),
  city text NOT NULL CHECK (char_length(city) <= 80),
  state text NOT NULL CHECK (char_length(state) <= 80),
  pincode text NOT NULL CHECK (pincode ~ '^[1-9][0-9]{5}$'),
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX addresses_user_idx ON public.addresses (user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.addresses TO authenticated;
GRANT ALL ON public.addresses TO service_role;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own addresses" ON public.addresses FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- WISHLIST
CREATE TABLE public.wishlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, listing_id)
);
CREATE INDEX wishlist_listing_idx ON public.wishlist (listing_id);
GRANT SELECT, INSERT, DELETE ON public.wishlist TO authenticated;
GRANT ALL ON public.wishlist TO service_role;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own wishlist" ON public.wishlist FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- CART (one copy per listing)
CREATE TABLE public.cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  quantity smallint NOT NULL DEFAULT 1 CHECK (quantity = 1),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, listing_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cart_items TO authenticated;
GRANT ALL ON public.cart_items TO service_role;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own cart" ON public.cart_items FOR ALL TO authenticated USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.listings l WHERE l.id = listing_id AND l.status = 'active' AND l.seller_id <> auth.uid()));

-- ORDERS
CREATE TYPE public.order_status AS ENUM ('pending','confirmed','completed','cancelled');
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  address_id uuid REFERENCES public.addresses(id) ON DELETE SET NULL,
  status public.order_status NOT NULL DEFAULT 'pending',
  total numeric(10,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX orders_buyer_idx ON public.orders (buyer_id);
CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE RESTRICT,
  seller_id uuid NOT NULL REFERENCES public.profiles(id),
  price numeric(10,2) NOT NULL CHECK (price > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (listing_id)
);
CREATE INDEX order_items_order_idx ON public.order_items (order_id);
CREATE INDEX order_items_seller_idx ON public.order_items (seller_id);
GRANT SELECT ON public.orders, public.order_items TO authenticated;
GRANT ALL ON public.orders, public.order_items TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Buyers see own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = buyer_id);
CREATE POLICY "Sellers see orders with their items" ON public.orders FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.order_items oi WHERE oi.order_id = id AND oi.seller_id = auth.uid()));
CREATE POLICY "Order item participants" ON public.order_items FOR SELECT TO authenticated
  USING (seller_id = auth.uid() OR EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.buyer_id = auth.uid()));
CREATE TRIGGER orders_updated BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- REVIEWS (one per purchased item, completed orders only)
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id uuid NOT NULL UNIQUE REFERENCES public.order_items(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text CHECK (char_length(comment) <= 1000),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX reviews_seller_idx ON public.reviews (seller_id);
GRANT SELECT ON public.reviews TO anon;
GRANT SELECT, INSERT ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews are public" ON public.reviews FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Verified buyers review" ON public.reviews FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = reviewer_id AND EXISTS (
    SELECT 1 FROM public.order_items oi JOIN public.orders o ON o.id = oi.order_id
    WHERE oi.id = order_item_id AND o.buyer_id = auth.uid() AND o.status = 'completed' AND oi.seller_id = reviews.seller_id));

-- NOTIFICATIONS
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text,
  link text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX notifications_user_idx ON public.notifications (user_id, created_at DESC);
GRANT SELECT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own notifications read" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own notifications update" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own notifications delete" ON public.notifications FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- STORAGE policies for listing-images bucket (folder = user id)
CREATE POLICY "Listing images public read" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'listing-images');
CREATE POLICY "Users upload own listing images" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'listing-images' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users delete own listing images" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'listing-images' AND (storage.foldername(name))[1] = auth.uid()::text);
