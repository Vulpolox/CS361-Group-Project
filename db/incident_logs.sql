PGDMP                      }        
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
                postgres    false            �            1259    90889    incident_logs    TABLE     �   CREATE TABLE public.incident_logs (
    id integer NOT NULL,
    threat character varying(255) NOT NULL,
    response_plan text NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
 !   DROP TABLE public.incident_logs;
       public         heap    postgres    false            �            1259    90888    incident_logs_id_seq    SEQUENCE     �   CREATE SEQUENCE public.incident_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.incident_logs_id_seq;
       public          postgres    false    224            �           0    0    incident_logs_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.incident_logs_id_seq OWNED BY public.incident_logs.id;
          public          postgres    false    223            _           2604    90892    incident_logs id    DEFAULT     t   ALTER TABLE ONLY public.incident_logs ALTER COLUMN id SET DEFAULT nextval('public.incident_logs_id_seq'::regclass);
 ?   ALTER TABLE public.incident_logs ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    223    224    224            �          0    90889    incident_logs 
   TABLE DATA           O   COPY public.incident_logs (id, threat, response_plan, "timestamp") FROM stdin;
    public          postgres    false    224   e       �           0    0    incident_logs_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.incident_logs_id_seq', 1, false);
          public          postgres    false    223            b           2606    90897     incident_logs incident_logs_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.incident_logs
    ADD CONSTRAINT incident_logs_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.incident_logs DROP CONSTRAINT incident_logs_pkey;
       public            postgres    false    224            �      x������ � �     