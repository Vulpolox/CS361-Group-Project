PGDMP  8                    }        
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
                postgres    false            �            1259    82647    threat_data    TABLE     �   CREATE TABLE public.threat_data (
    id integer NOT NULL,
    ip_address character varying(50) NOT NULL,
    ports text,
    hostnames text,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.threat_data;
       public         heap    postgres    false            �            1259    82646    threat_data_id_seq    SEQUENCE     �   CREATE SEQUENCE public.threat_data_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.threat_data_id_seq;
       public          postgres    false    220            �           0    0    threat_data_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.threat_data_id_seq OWNED BY public.threat_data.id;
          public          postgres    false    219            W           2604    82650    threat_data id    DEFAULT     p   ALTER TABLE ONLY public.threat_data ALTER COLUMN id SET DEFAULT nextval('public.threat_data_id_seq'::regclass);
 =   ALTER TABLE public.threat_data ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    220    220            �          0    82647    threat_data 
   TABLE DATA           T   COPY public.threat_data (id, ip_address, ports, hostnames, "timestamp") FROM stdin;
    public          postgres    false    220   C       �           0    0    threat_data_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.threat_data_id_seq', 1, true);
          public          postgres    false    219            Z           2606    82655    threat_data threat_data_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.threat_data
    ADD CONSTRAINT threat_data_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.threat_data DROP CONSTRAINT threat_data_pkey;
       public            postgres    false    220            �   A   x�3��CNcScΔ�b������TN##S]c]#CC+s+#K=3Cs�=... �3�     