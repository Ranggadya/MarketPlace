-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  image_url text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.guest_reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL,
  guest_name character varying NOT NULL,
  guest_email character varying NOT NULL,
  guest_phone character varying NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT guest_reviews_pkey PRIMARY KEY (id),
  CONSTRAINT guest_reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL,
  category_id uuid,
  name text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0::numeric),
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  weight numeric DEFAULT 0,
  condition text DEFAULT 'Baru'::text CHECK (condition = ANY (ARRAY['Baru'::text, 'Bekas'::text])),
  status text DEFAULT 'active'::text CHECK (status = ANY (ARRAY['active'::text, 'inactive'::text, 'archived'::text])),
  images ARRAY,
  rating numeric DEFAULT 0,
  sold_count integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id)
);
CREATE TABLE public.sellers (
  id uuid,
  store_name text NOT NULL,
  store_description text,
  store_slug text UNIQUE,
  pic_name text NOT NULL,
  pic_phone text,
  pic_email text UNIQUE,
  pic_street text,
  pic_rt text,
  pic_rw text,
  pic_village text,
  pic_city text,
  pic_province text,
  pic_postal_code text,
  pic_ktp_number text,
  pic_ktp_url text,
  pic_photo_url text,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'active'::text, 'suspended'::text, 'rejected'::text])),
  balance numeric DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  rejection_reason text,
  approved_by uuid,
  approved_at timestamp with time zone,
  generated_password text,
  internal_id bigint NOT NULL DEFAULT nextval('sellers_internal_id_seq'::regclass),
  CONSTRAINT sellers_pkey PRIMARY KEY (internal_id),
  CONSTRAINT sellers_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id),
  CONSTRAINT sellers_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES auth.users(id)
);
