PGDMP      #                }        
   Assigment2    16.3    16.3     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    82540 
   Assigment2    DATABASE     �   CREATE DATABASE "Assigment2" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1258';
    DROP DATABASE "Assigment2";
                postgres    false            �            1259    90879    alerts    TABLE     �   CREATE TABLE public.alerts (
    id integer NOT NULL,
    threat text NOT NULL,
    risk_score integer NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.alerts;
       public         heap    postgres    false            �            1259    90878    alerts_id_seq    SEQUENCE     �   CREATE SEQUENCE public.alerts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.alerts_id_seq;
       public          postgres    false    222            �           0    0    alerts_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.alerts_id_seq OWNED BY public.alerts.id;
          public          postgres    false    221            [           2604    90882 	   alerts id    DEFAULT     f   ALTER TABLE ONLY public.alerts ALTER COLUMN id SET DEFAULT nextval('public.alerts_id_seq'::regclass);
 8   ALTER TABLE public.alerts ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    222    221    222            �          0    90879    alerts 
   TABLE DATA           E   COPY public.alerts (id, threat, risk_score, "timestamp") FROM stdin;
    public          postgres    false    222   �
       �           0    0    alerts_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.alerts_id_seq', 1, false);
          public          postgres    false    221            ^           2606    90887    alerts alerts_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.alerts
    ADD CONSTRAINT alerts_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.alerts DROP CONSTRAINT alerts_pkey;
       public            postgres    false    222            �      x������ � �     