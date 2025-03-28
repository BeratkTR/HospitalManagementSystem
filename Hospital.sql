PGDMP      *                |            HastaneYonetimSistemi    16.2    16.0 �    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    17312    HastaneYonetimSistemi    DATABASE     �   CREATE DATABASE "HastaneYonetimSistemi" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'tr_TR.UTF-8';
 '   DROP DATABASE "HastaneYonetimSistemi";
                postgres    false            �            1255    17681    fatura_kaydı()    FUNCTION     �   CREATE FUNCTION public."fatura_kaydı"() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO fatura_kayitlari(tutar, ödenme_tarihi)
VALUES (OLD.tutar, CURRENT_TIMESTAMP);

    RETURN OLD;
END;
$$;
 (   DROP FUNCTION public."fatura_kaydı"();
       public          postgres    false            �            1255    17679    geçmiş_randevu_engeli()    FUNCTION     �   CREATE FUNCTION public."geçmiş_randevu_engeli"() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.tarih < NOW() THEN
        RAISE EXCEPTION 'geçmişe randevu alınamaz !';
    END IF;

    RETURN NEW;
END;
$$;
 2   DROP FUNCTION public."geçmiş_randevu_engeli"();
       public          postgres    false            �            1255    17655 (   hasta_ekle(text, text, text, text, date) 	   PROCEDURE     <  CREATE PROCEDURE public.hasta_ekle(IN isim text, IN "şifre" text, IN numara text, IN cinsiyet text, IN dogum_tarihi date)
    LANGUAGE plpgsql
    AS $$ 
    BEGIN
        INSERT INTO patients(name, password, phone_number, gender, birth_date) VALUES (isim, şifre, numara, cinsiyet, dogum_tarihi);
    END;
    $$;
 z   DROP PROCEDURE public.hasta_ekle(IN isim text, IN "şifre" text, IN numara text, IN cinsiyet text, IN dogum_tarihi date);
       public          postgres    false            �            1255    17662    hesapla_fatura(integer) 	   PROCEDURE     W  CREATE PROCEDURE public.hesapla_fatura(IN tedavi_id integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
    toplam_tutar NUMERIC(10, 2) := 0;
    record_row RECORD;
BEGIN
    FOR record_row IN
        SELECT i.fiyat, ti.miktar
        FROM tedavideki_islemler ti
        JOIN islemler i ON ti.islem_id = i.id
        WHERE ti.tedavi_id = tedavi_id
    LOOP
        toplam_tutar := toplam_tutar + (record_row.fiyat * record_row.miktar);
    END LOOP;
    
    -- Optionally, return the result if using this in a function
    RAISE NOTICE 'Toplam Tutar: %', toplam_tutar; -- For debugging output
END;
$$;
 <   DROP PROCEDURE public.hesapla_fatura(IN tedavi_id integer);
       public          postgres    false            �            1255    17657    randevu_iptal(integer) 	   PROCEDURE     �   CREATE PROCEDURE public.randevu_iptal(IN p_appointment_id integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM appointments WHERE appointment_id = p_appointment_id;
END;
$$;
 B   DROP PROCEDURE public.randevu_iptal(IN p_appointment_id integer);
       public          postgres    false            �            1255    17676    randevu_kaydı()    FUNCTION     �   CREATE FUNCTION public."randevu_kaydı"() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO randevu_kayitlari(durum, hasta_id, doktor_id)
VALUES ('tedavi edildi', OLD.hasta_id, OLD.doktor_id);

    RETURN OLD;
END;
$$;
 )   DROP FUNCTION public."randevu_kaydı"();
       public          postgres    false            �            1255    17656 0   randevu_olustur(date, integer, integer, integer) 	   PROCEDURE     (  CREATE PROCEDURE public.randevu_olustur(IN tarih date, IN saat integer, IN hasta_id integer, IN doktor_id integer)
    LANGUAGE plpgsql
    AS $$ 
    BEGIN
        INSERT INTO appointments(tarih, saat, patient_id, doctor_id) 
        VALUES (tarih, saat, hasta_id, doktor_id);
    END;
     $$;
 r   DROP PROCEDURE public.randevu_olustur(IN tarih date, IN saat integer, IN hasta_id integer, IN doktor_id integer);
       public          postgres    false            �            1255    17671    randevulu_hasta_silme_engelle()    FUNCTION        CREATE FUNCTION public.randevulu_hasta_silme_engelle() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM appointments WHERE patient_id = OLD.patient_id) THEN
        RAISE EXCEPTION 'randevusu olan hasta silinemez !';
    END IF;

    RETURN OLD;
END;
$$;
 6   DROP FUNCTION public.randevulu_hasta_silme_engelle();
       public          postgres    false            �            1259    17328    admin    TABLE     �   CREATE TABLE public.admin (
    id integer NOT NULL,
    name character varying(30) NOT NULL,
    password character varying(20) NOT NULL
);
    DROP TABLE public.admin;
       public         heap    postgres    false            �            1259    17327    admin_id_seq    SEQUENCE     �   CREATE SEQUENCE public.admin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.admin_id_seq;
       public          postgres    false    216            �           0    0    admin_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.admin_id_seq OWNED BY public.admin.id;
          public          postgres    false    215            �            1259    17543    appointment_logs    TABLE     �   CREATE TABLE public.appointment_logs (
    id integer NOT NULL,
    status character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    patient_id integer NOT NULL,
    doctor_id integer NOT NULL
);
 $   DROP TABLE public.appointment_logs;
       public         heap    postgres    false            �            1259    17542    appointment_logs_id_seq    SEQUENCE     �   CREATE SEQUENCE public.appointment_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.appointment_logs_id_seq;
       public          postgres    false    232            �           0    0    appointment_logs_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.appointment_logs_id_seq OWNED BY public.appointment_logs.id;
          public          postgres    false    231            �            1259    17363    appointments    TABLE       CREATE TABLE public.appointments (
    id integer NOT NULL,
    tarih date NOT NULL,
    saat integer NOT NULL,
    patient_id integer NOT NULL,
    doctor_id integer NOT NULL,
    CONSTRAINT appointments_saat_check CHECK (((saat >= 10) AND (saat <= 16)))
);
     DROP TABLE public.appointments;
       public         heap    postgres    false            �            1259    17362    appointments_id_seq    SEQUENCE     �   CREATE SEQUENCE public.appointments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.appointments_id_seq;
       public          postgres    false    222            �           0    0    appointments_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.appointments_id_seq OWNED BY public.appointments.id;
          public          postgres    false    221            �            1259    17392    cities    TABLE     a   CREATE TABLE public.cities (
    id integer NOT NULL,
    name character varying(30) NOT NULL
);
    DROP TABLE public.cities;
       public         heap    postgres    false            �            1259    17391    cities_id_seq    SEQUENCE     �   CREATE SEQUENCE public.cities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.cities_id_seq;
       public          postgres    false    224            �           0    0    cities_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.cities_id_seq OWNED BY public.cities.id;
          public          postgres    false    223            �            1259    17413    departments    TABLE     U   CREATE TABLE public.departments (
    id integer NOT NULL,
    name text NOT NULL
);
    DROP TABLE public.departments;
       public         heap    postgres    false            �            1259    17412    departments_id_seq    SEQUENCE     �   CREATE SEQUENCE public.departments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.departments_id_seq;
       public          postgres    false    228            �           0    0    departments_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.departments_id_seq OWNED BY public.departments.id;
          public          postgres    false    227            �            1259    17347    doctors    TABLE     M  CREATE TABLE public.doctors (
    id integer NOT NULL,
    name character varying(30) NOT NULL,
    password character varying(20) NOT NULL,
    phone_number character varying(15) NOT NULL,
    department_id integer NOT NULL,
    gender character varying(6),
    CONSTRAINT check_name_not_empty CHECK (((name)::text <> ''::text))
);
    DROP TABLE public.doctors;
       public         heap    postgres    false            �            1259    17346    doctors_id_seq    SEQUENCE     �   CREATE SEQUENCE public.doctors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.doctors_id_seq;
       public          postgres    false    218            �           0    0    doctors_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.doctors_id_seq OWNED BY public.doctors.id;
          public          postgres    false    217            �            1259    17623    fatura_kayitlari    TABLE     �   CREATE TABLE public.fatura_kayitlari (
    id integer NOT NULL,
    tutar integer NOT NULL,
    odenme_tarihi timestamp without time zone NOT NULL
);
 $   DROP TABLE public.fatura_kayitlari;
       public         heap    postgres    false            �            1259    17622    fatura_kayitlari_id_seq    SEQUENCE     �   CREATE SEQUENCE public.fatura_kayitlari_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.fatura_kayitlari_id_seq;
       public          postgres    false    242            �           0    0    fatura_kayitlari_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.fatura_kayitlari_id_seq OWNED BY public.fatura_kayitlari.id;
          public          postgres    false    241            �            1259    17576 	   faturalar    TABLE     �   CREATE TABLE public.faturalar (
    id integer NOT NULL,
    tutar integer NOT NULL,
    tarih timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.faturalar;
       public         heap    postgres    false            �            1259    17575    faturalar_id_seq    SEQUENCE     �   CREATE SEQUENCE public.faturalar_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.faturalar_id_seq;
       public          postgres    false    236            �           0    0    faturalar_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.faturalar_id_seq OWNED BY public.faturalar.id;
          public          postgres    false    235            �            1259    17481    hastane_departmanlari    TABLE     �   CREATE TABLE public.hastane_departmanlari (
    id integer NOT NULL,
    hastane_id integer NOT NULL,
    department_id integer NOT NULL
);
 )   DROP TABLE public.hastane_departmanlari;
       public         heap    postgres    false            �            1259    17480    hastane_departmanlari_id_seq    SEQUENCE     �   CREATE SEQUENCE public.hastane_departmanlari_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE public.hastane_departmanlari_id_seq;
       public          postgres    false    230            �           0    0    hastane_departmanlari_id_seq    SEQUENCE OWNED BY     ]   ALTER SEQUENCE public.hastane_departmanlari_id_seq OWNED BY public.hastane_departmanlari.id;
          public          postgres    false    229            �            1259    17399 
   hastaneler    TABLE     j   CREATE TABLE public.hastaneler (
    id integer NOT NULL,
    name text NOT NULL,
    sehir_id integer
);
    DROP TABLE public.hastaneler;
       public         heap    postgres    false            �            1259    17398    hastaneler_id_seq    SEQUENCE     �   CREATE SEQUENCE public.hastaneler_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.hastaneler_id_seq;
       public          postgres    false    226            �           0    0    hastaneler_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.hastaneler_id_seq OWNED BY public.hastaneler.id;
          public          postgres    false    225            �            1259    17599    ilaclar    TABLE     b   CREATE TABLE public.ilaclar (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);
    DROP TABLE public.ilaclar;
       public         heap    postgres    false            �            1259    17598    ilaclar_id_seq    SEQUENCE     �   CREATE SEQUENCE public.ilaclar_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.ilaclar_id_seq;
       public          postgres    false    238            �           0    0    ilaclar_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.ilaclar_id_seq OWNED BY public.ilaclar.id;
          public          postgres    false    237            �            1259    17630    islemler    TABLE        CREATE TABLE public.islemler (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    price integer NOT NULL
);
    DROP TABLE public.islemler;
       public         heap    postgres    false            �            1259    17629    islemler_id_seq    SEQUENCE     �   CREATE SEQUENCE public.islemler_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.islemler_id_seq;
       public          postgres    false    244            �           0    0    islemler_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.islemler_id_seq OWNED BY public.islemler.id;
          public          postgres    false    243            �            1259    17354    patients    TABLE     X  CREATE TABLE public.patients (
    id integer NOT NULL,
    name character varying(30) NOT NULL,
    password character varying(30) NOT NULL,
    phone_number character varying(15) NOT NULL,
    gender character varying(6) NOT NULL,
    birth_date date NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
    DROP TABLE public.patients;
       public         heap    postgres    false            �            1259    17353    patients_id_seq    SEQUENCE     �   CREATE SEQUENCE public.patients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.patients_id_seq;
       public          postgres    false    220            �           0    0    patients_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.patients_id_seq OWNED BY public.patients.id;
          public          postgres    false    219            �            1259    17606    tedavideki_ilaclar    TABLE     �   CREATE TABLE public.tedavideki_ilaclar (
    id integer NOT NULL,
    ilac_id integer NOT NULL,
    tedavi_id integer NOT NULL
);
 &   DROP TABLE public.tedavideki_ilaclar;
       public         heap    postgres    false            �            1259    17605    tedavideki_ilaclar_id_seq    SEQUENCE     �   CREATE SEQUENCE public.tedavideki_ilaclar_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.tedavideki_ilaclar_id_seq;
       public          postgres    false    240            �           0    0    tedavideki_ilaclar_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.tedavideki_ilaclar_id_seq OWNED BY public.tedavideki_ilaclar.id;
          public          postgres    false    239            �            1259    17637    tedavideki_islemler    TABLE     u   CREATE TABLE public.tedavideki_islemler (
    id integer NOT NULL,
    islem_id integer,
    treatment_id integer
);
 '   DROP TABLE public.tedavideki_islemler;
       public         heap    postgres    false            �            1259    17636    tedavideki_islemler_id_seq    SEQUENCE     �   CREATE SEQUENCE public.tedavideki_islemler_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.tedavideki_islemler_id_seq;
       public          postgres    false    246            �           0    0    tedavideki_islemler_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public.tedavideki_islemler_id_seq OWNED BY public.tedavideki_islemler.id;
          public          postgres    false    245            �            1259    17561 
   treatments    TABLE     �   CREATE TABLE public.treatments (
    id integer NOT NULL,
    teshis text NOT NULL,
    tarih timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fatura_id integer NOT NULL,
    hasta_id integer NOT NULL,
    appointment_id integer NOT NULL
);
    DROP TABLE public.treatments;
       public         heap    postgres    false            �            1259    17560    treatments_id_seq    SEQUENCE     �   CREATE SEQUENCE public.treatments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.treatments_id_seq;
       public          postgres    false    234            �           0    0    treatments_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.treatments_id_seq OWNED BY public.treatments.id;
          public          postgres    false    233            �           2604    17331    admin id    DEFAULT     d   ALTER TABLE ONLY public.admin ALTER COLUMN id SET DEFAULT nextval('public.admin_id_seq'::regclass);
 7   ALTER TABLE public.admin ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    215    216            �           2604    17546    appointment_logs id    DEFAULT     z   ALTER TABLE ONLY public.appointment_logs ALTER COLUMN id SET DEFAULT nextval('public.appointment_logs_id_seq'::regclass);
 B   ALTER TABLE public.appointment_logs ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    232    231    232            �           2604    17366    appointments id    DEFAULT     r   ALTER TABLE ONLY public.appointments ALTER COLUMN id SET DEFAULT nextval('public.appointments_id_seq'::regclass);
 >   ALTER TABLE public.appointments ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    222    221    222            �           2604    17395 	   cities id    DEFAULT     f   ALTER TABLE ONLY public.cities ALTER COLUMN id SET DEFAULT nextval('public.cities_id_seq'::regclass);
 8   ALTER TABLE public.cities ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    223    224    224            �           2604    17416    departments id    DEFAULT     p   ALTER TABLE ONLY public.departments ALTER COLUMN id SET DEFAULT nextval('public.departments_id_seq'::regclass);
 =   ALTER TABLE public.departments ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    228    227    228            �           2604    17350 
   doctors id    DEFAULT     h   ALTER TABLE ONLY public.doctors ALTER COLUMN id SET DEFAULT nextval('public.doctors_id_seq'::regclass);
 9   ALTER TABLE public.doctors ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    218    217    218            �           2604    17626    fatura_kayitlari id    DEFAULT     z   ALTER TABLE ONLY public.fatura_kayitlari ALTER COLUMN id SET DEFAULT nextval('public.fatura_kayitlari_id_seq'::regclass);
 B   ALTER TABLE public.fatura_kayitlari ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    242    241    242            �           2604    17579    faturalar id    DEFAULT     l   ALTER TABLE ONLY public.faturalar ALTER COLUMN id SET DEFAULT nextval('public.faturalar_id_seq'::regclass);
 ;   ALTER TABLE public.faturalar ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    235    236    236            �           2604    17484    hastane_departmanlari id    DEFAULT     �   ALTER TABLE ONLY public.hastane_departmanlari ALTER COLUMN id SET DEFAULT nextval('public.hastane_departmanlari_id_seq'::regclass);
 G   ALTER TABLE public.hastane_departmanlari ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    229    230    230            �           2604    17402    hastaneler id    DEFAULT     n   ALTER TABLE ONLY public.hastaneler ALTER COLUMN id SET DEFAULT nextval('public.hastaneler_id_seq'::regclass);
 <   ALTER TABLE public.hastaneler ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    226    225    226            �           2604    17602 
   ilaclar id    DEFAULT     h   ALTER TABLE ONLY public.ilaclar ALTER COLUMN id SET DEFAULT nextval('public.ilaclar_id_seq'::regclass);
 9   ALTER TABLE public.ilaclar ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    237    238    238            �           2604    17633    islemler id    DEFAULT     j   ALTER TABLE ONLY public.islemler ALTER COLUMN id SET DEFAULT nextval('public.islemler_id_seq'::regclass);
 :   ALTER TABLE public.islemler ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    243    244    244            �           2604    17357    patients id    DEFAULT     j   ALTER TABLE ONLY public.patients ALTER COLUMN id SET DEFAULT nextval('public.patients_id_seq'::regclass);
 :   ALTER TABLE public.patients ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    220    219    220            �           2604    17609    tedavideki_ilaclar id    DEFAULT     ~   ALTER TABLE ONLY public.tedavideki_ilaclar ALTER COLUMN id SET DEFAULT nextval('public.tedavideki_ilaclar_id_seq'::regclass);
 D   ALTER TABLE public.tedavideki_ilaclar ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    239    240    240            �           2604    17640    tedavideki_islemler id    DEFAULT     �   ALTER TABLE ONLY public.tedavideki_islemler ALTER COLUMN id SET DEFAULT nextval('public.tedavideki_islemler_id_seq'::regclass);
 E   ALTER TABLE public.tedavideki_islemler ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    245    246    246            �           2604    17564    treatments id    DEFAULT     n   ALTER TABLE ONLY public.treatments ALTER COLUMN id SET DEFAULT nextval('public.treatments_id_seq'::regclass);
 <   ALTER TABLE public.treatments ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    234    233    234            �          0    17328    admin 
   TABLE DATA           3   COPY public.admin (id, name, password) FROM stdin;
    public          postgres    false    216   ��       �          0    17543    appointment_logs 
   TABLE DATA           Y   COPY public.appointment_logs (id, status, created_at, patient_id, doctor_id) FROM stdin;
    public          postgres    false    232   �       �          0    17363    appointments 
   TABLE DATA           N   COPY public.appointments (id, tarih, saat, patient_id, doctor_id) FROM stdin;
    public          postgres    false    222   :�       �          0    17392    cities 
   TABLE DATA           *   COPY public.cities (id, name) FROM stdin;
    public          postgres    false    224   }�       �          0    17413    departments 
   TABLE DATA           /   COPY public.departments (id, name) FROM stdin;
    public          postgres    false    228   ��       �          0    17347    doctors 
   TABLE DATA           Z   COPY public.doctors (id, name, password, phone_number, department_id, gender) FROM stdin;
    public          postgres    false    218   �       �          0    17623    fatura_kayitlari 
   TABLE DATA           D   COPY public.fatura_kayitlari (id, tutar, odenme_tarihi) FROM stdin;
    public          postgres    false    242   w�       �          0    17576 	   faturalar 
   TABLE DATA           5   COPY public.faturalar (id, tutar, tarih) FROM stdin;
    public          postgres    false    236   ��       �          0    17481    hastane_departmanlari 
   TABLE DATA           N   COPY public.hastane_departmanlari (id, hastane_id, department_id) FROM stdin;
    public          postgres    false    230   ��       �          0    17399 
   hastaneler 
   TABLE DATA           8   COPY public.hastaneler (id, name, sehir_id) FROM stdin;
    public          postgres    false    226   �       �          0    17599    ilaclar 
   TABLE DATA           +   COPY public.ilaclar (id, name) FROM stdin;
    public          postgres    false    238   e�       �          0    17630    islemler 
   TABLE DATA           3   COPY public.islemler (id, name, price) FROM stdin;
    public          postgres    false    244   ��       �          0    17354    patients 
   TABLE DATA           d   COPY public.patients (id, name, password, phone_number, gender, birth_date, created_at) FROM stdin;
    public          postgres    false    220   ��       �          0    17606    tedavideki_ilaclar 
   TABLE DATA           D   COPY public.tedavideki_ilaclar (id, ilac_id, tedavi_id) FROM stdin;
    public          postgres    false    240   �       �          0    17637    tedavideki_islemler 
   TABLE DATA           I   COPY public.tedavideki_islemler (id, islem_id, treatment_id) FROM stdin;
    public          postgres    false    246   9�       �          0    17561 
   treatments 
   TABLE DATA           \   COPY public.treatments (id, teshis, tarih, fatura_id, hasta_id, appointment_id) FROM stdin;
    public          postgres    false    234   V�       �           0    0    admin_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.admin_id_seq', 3, true);
          public          postgres    false    215            �           0    0    appointment_logs_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.appointment_logs_id_seq', 1, false);
          public          postgres    false    231            �           0    0    appointments_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.appointments_id_seq', 50, true);
          public          postgres    false    221            �           0    0    cities_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.cities_id_seq', 3, true);
          public          postgres    false    223            �           0    0    departments_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.departments_id_seq', 8, true);
          public          postgres    false    227            �           0    0    doctors_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.doctors_id_seq', 57, true);
          public          postgres    false    217            �           0    0    fatura_kayitlari_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.fatura_kayitlari_id_seq', 1, false);
          public          postgres    false    241            �           0    0    faturalar_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.faturalar_id_seq', 1, false);
          public          postgres    false    235            �           0    0    hastane_departmanlari_id_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.hastane_departmanlari_id_seq', 18, true);
          public          postgres    false    229            �           0    0    hastaneler_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.hastaneler_id_seq', 4, true);
          public          postgres    false    225            �           0    0    ilaclar_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.ilaclar_id_seq', 1, false);
          public          postgres    false    237            �           0    0    islemler_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.islemler_id_seq', 1, false);
          public          postgres    false    243            �           0    0    patients_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.patients_id_seq', 31, true);
          public          postgres    false    219            �           0    0    tedavideki_ilaclar_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.tedavideki_ilaclar_id_seq', 1, false);
          public          postgres    false    239            �           0    0    tedavideki_islemler_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.tedavideki_islemler_id_seq', 1, false);
          public          postgres    false    245            �           0    0    treatments_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.treatments_id_seq', 1, false);
          public          postgres    false    233            �           2606    17336    admin admin_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.admin DROP CONSTRAINT admin_pkey;
       public            postgres    false    216            �           2606    17549 &   appointment_logs appointment_logs_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.appointment_logs
    ADD CONSTRAINT appointment_logs_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.appointment_logs DROP CONSTRAINT appointment_logs_pkey;
       public            postgres    false    232            �           2606    17370    appointments appointments_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.appointments DROP CONSTRAINT appointments_pkey;
       public            postgres    false    222            �           2606    17397    cities cities_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.cities
    ADD CONSTRAINT cities_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.cities DROP CONSTRAINT cities_pkey;
       public            postgres    false    224            �           2606    17420    departments departments_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.departments DROP CONSTRAINT departments_pkey;
       public            postgres    false    228            �           2606    17438     doctors doctors_phone_number_key 
   CONSTRAINT     c   ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_phone_number_key UNIQUE (phone_number);
 J   ALTER TABLE ONLY public.doctors DROP CONSTRAINT doctors_phone_number_key;
       public            postgres    false    218            �           2606    17352    doctors doctors_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.doctors DROP CONSTRAINT doctors_pkey;
       public            postgres    false    218            �           2606    17628 &   fatura_kayitlari fatura_kayitlari_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.fatura_kayitlari
    ADD CONSTRAINT fatura_kayitlari_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.fatura_kayitlari DROP CONSTRAINT fatura_kayitlari_pkey;
       public            postgres    false    242            �           2606    17582    faturalar faturalar_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.faturalar
    ADD CONSTRAINT faturalar_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.faturalar DROP CONSTRAINT faturalar_pkey;
       public            postgres    false    236            �           2606    17486 0   hastane_departmanlari hastane_departmanlari_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY public.hastane_departmanlari
    ADD CONSTRAINT hastane_departmanlari_pkey PRIMARY KEY (id);
 Z   ALTER TABLE ONLY public.hastane_departmanlari DROP CONSTRAINT hastane_departmanlari_pkey;
       public            postgres    false    230            �           2606    17406    hastaneler hastaneler_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.hastaneler
    ADD CONSTRAINT hastaneler_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.hastaneler DROP CONSTRAINT hastaneler_pkey;
       public            postgres    false    226            �           2606    17604    ilaclar ilaclar_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.ilaclar
    ADD CONSTRAINT ilaclar_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.ilaclar DROP CONSTRAINT ilaclar_pkey;
       public            postgres    false    238            �           2606    17635    islemler islemler_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.islemler
    ADD CONSTRAINT islemler_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.islemler DROP CONSTRAINT islemler_pkey;
       public            postgres    false    244            �           2606    17436 "   patients patients_phone_number_key 
   CONSTRAINT     e   ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_phone_number_key UNIQUE (phone_number);
 L   ALTER TABLE ONLY public.patients DROP CONSTRAINT patients_phone_number_key;
       public            postgres    false    220            �           2606    17359    patients patients_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.patients DROP CONSTRAINT patients_pkey;
       public            postgres    false    220            �           2606    17611 *   tedavideki_ilaclar tedavideki_ilaclar_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.tedavideki_ilaclar
    ADD CONSTRAINT tedavideki_ilaclar_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public.tedavideki_ilaclar DROP CONSTRAINT tedavideki_ilaclar_pkey;
       public            postgres    false    240                       2606    17642 ,   tedavideki_islemler tedavideki_islemler_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.tedavideki_islemler
    ADD CONSTRAINT tedavideki_islemler_pkey PRIMARY KEY (id);
 V   ALTER TABLE ONLY public.tedavideki_islemler DROP CONSTRAINT tedavideki_islemler_pkey;
       public            postgres    false    246            �           2606    17569    treatments treatments_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.treatments
    ADD CONSTRAINT treatments_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.treatments DROP CONSTRAINT treatments_pkey;
       public            postgres    false    234            �           2606    17361    patients unique_url 
   CONSTRAINT     N   ALTER TABLE ONLY public.patients
    ADD CONSTRAINT unique_url UNIQUE (name);
 =   ALTER TABLE ONLY public.patients DROP CONSTRAINT unique_url;
       public            postgres    false    220                       2620    17682    patients fatura_kaydı    TRIGGER     x   CREATE TRIGGER "fatura_kaydı" BEFORE DELETE ON public.patients FOR EACH ROW EXECUTE FUNCTION public."fatura_kaydı"();
 1   DROP TRIGGER "fatura_kaydı" ON public.patients;
       public          postgres    false    220    254                       2620    17680 $   appointments geçmiş_randevu_engeli    TRIGGER     �   CREATE TRIGGER "geçmiş_randevu_engeli" BEFORE INSERT ON public.appointments FOR EACH ROW EXECUTE FUNCTION public."geçmiş_randevu_engeli"();
 ?   DROP TRIGGER "geçmiş_randevu_engeli" ON public.appointments;
       public          postgres    false    222    253                       2620    17677    patients randevu_kaydı    TRIGGER     y   CREATE TRIGGER "randevu_kaydı" AFTER DELETE ON public.patients FOR EACH ROW EXECUTE FUNCTION public."randevu_kaydı"();
 2   DROP TRIGGER "randevu_kaydı" ON public.patients;
       public          postgres    false    220    252                       2620    17672 &   patients randevulu_hasta_silme_engelle    TRIGGER     �   CREATE TRIGGER randevulu_hasta_silme_engelle BEFORE DELETE ON public.patients FOR EACH ROW EXECUTE FUNCTION public.randevulu_hasta_silme_engelle();
 ?   DROP TRIGGER randevulu_hasta_silme_engelle ON public.patients;
       public          postgres    false    220    251                       2606    17555 0   appointment_logs appointment_logs_doctor_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.appointment_logs
    ADD CONSTRAINT appointment_logs_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) ON DELETE CASCADE;
 Z   ALTER TABLE ONLY public.appointment_logs DROP CONSTRAINT appointment_logs_doctor_id_fkey;
       public          postgres    false    3553    232    218            	           2606    17550 1   appointment_logs appointment_logs_patient_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.appointment_logs
    ADD CONSTRAINT appointment_logs_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;
 [   ALTER TABLE ONLY public.appointment_logs DROP CONSTRAINT appointment_logs_patient_id_fkey;
       public          postgres    false    220    3557    232                       2606    17512 (   appointments appointments_doctor_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) ON DELETE CASCADE;
 R   ALTER TABLE ONLY public.appointments DROP CONSTRAINT appointments_doctor_id_fkey;
       public          postgres    false    3553    218    222                       2606    17507 )   appointments appointments_patient_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;
 S   ALTER TABLE ONLY public.appointments DROP CONSTRAINT appointments_patient_id_fkey;
       public          postgres    false    220    222    3557                       2606    17522 "   doctors doctors_department_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.hastane_departmanlari(id) ON DELETE CASCADE;
 L   ALTER TABLE ONLY public.doctors DROP CONSTRAINT doctors_department_id_fkey;
       public          postgres    false    230    218    3569                       2606    17532 >   hastane_departmanlari hastane_departmanlari_department_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.hastane_departmanlari
    ADD CONSTRAINT hastane_departmanlari_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE CASCADE;
 h   ALTER TABLE ONLY public.hastane_departmanlari DROP CONSTRAINT hastane_departmanlari_department_id_fkey;
       public          postgres    false    228    230    3567                       2606    17527 ;   hastane_departmanlari hastane_departmanlari_hastane_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.hastane_departmanlari
    ADD CONSTRAINT hastane_departmanlari_hastane_id_fkey FOREIGN KEY (hastane_id) REFERENCES public.hastaneler(id) ON DELETE CASCADE;
 e   ALTER TABLE ONLY public.hastane_departmanlari DROP CONSTRAINT hastane_departmanlari_hastane_id_fkey;
       public          postgres    false    3565    226    230                       2606    17537 #   hastaneler hastaneler_sehir_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.hastaneler
    ADD CONSTRAINT hastaneler_sehir_id_fkey FOREIGN KEY (sehir_id) REFERENCES public.cities(id) ON DELETE CASCADE;
 M   ALTER TABLE ONLY public.hastaneler DROP CONSTRAINT hastaneler_sehir_id_fkey;
       public          postgres    false    224    226    3563                       2606    17612 2   tedavideki_ilaclar tedavideki_ilaclar_ilac_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.tedavideki_ilaclar
    ADD CONSTRAINT tedavideki_ilaclar_ilac_id_fkey FOREIGN KEY (ilac_id) REFERENCES public.ilaclar(id) ON DELETE CASCADE;
 \   ALTER TABLE ONLY public.tedavideki_ilaclar DROP CONSTRAINT tedavideki_ilaclar_ilac_id_fkey;
       public          postgres    false    240    3577    238                       2606    17617 4   tedavideki_ilaclar tedavideki_ilaclar_tedavi_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.tedavideki_ilaclar
    ADD CONSTRAINT tedavideki_ilaclar_tedavi_id_fkey FOREIGN KEY (tedavi_id) REFERENCES public.treatments(id) ON DELETE CASCADE;
 ^   ALTER TABLE ONLY public.tedavideki_ilaclar DROP CONSTRAINT tedavideki_ilaclar_tedavi_id_fkey;
       public          postgres    false    234    3573    240                       2606    17643 5   tedavideki_islemler tedavideki_islemler_islem_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.tedavideki_islemler
    ADD CONSTRAINT tedavideki_islemler_islem_id_fkey FOREIGN KEY (islem_id) REFERENCES public.islemler(id) ON DELETE CASCADE;
 _   ALTER TABLE ONLY public.tedavideki_islemler DROP CONSTRAINT tedavideki_islemler_islem_id_fkey;
       public          postgres    false    3583    246    244                       2606    17648 9   tedavideki_islemler tedavideki_islemler_treatment_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.tedavideki_islemler
    ADD CONSTRAINT tedavideki_islemler_treatment_id_fkey FOREIGN KEY (treatment_id) REFERENCES public.treatments(id) ON DELETE CASCADE;
 c   ALTER TABLE ONLY public.tedavideki_islemler DROP CONSTRAINT tedavideki_islemler_treatment_id_fkey;
       public          postgres    false    246    3573    234            
           2606    17593 )   treatments treatments_appointment_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.treatments
    ADD CONSTRAINT treatments_appointment_id_fkey FOREIGN KEY (appointment_id) REFERENCES public.appointments(id) ON DELETE CASCADE;
 S   ALTER TABLE ONLY public.treatments DROP CONSTRAINT treatments_appointment_id_fkey;
       public          postgres    false    3561    222    234                       2606    17583 $   treatments treatments_fatura_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.treatments
    ADD CONSTRAINT treatments_fatura_id_fkey FOREIGN KEY (fatura_id) REFERENCES public.faturalar(id) ON DELETE CASCADE;
 N   ALTER TABLE ONLY public.treatments DROP CONSTRAINT treatments_fatura_id_fkey;
       public          postgres    false    234    236    3575                       2606    17588 #   treatments treatments_hasta_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.treatments
    ADD CONSTRAINT treatments_hasta_id_fkey FOREIGN KEY (hasta_id) REFERENCES public.patients(id) ON DELETE CASCADE;
 M   ALTER TABLE ONLY public.treatments DROP CONSTRAINT treatments_hasta_id_fkey;
       public          postgres    false    234    220    3557            �      x�3�LL����442����� &^�      �      x������ � �      �   3   x�3�4202�54�56�44�4�4�2B3��r����9�
c���� []
	      �   *   x�3�<���$1/�4�ˈ�1/;�(��(X��Y����� �i      �   A   x�3�tI���ɬL�2�t�<:�˂�93'$`��~x[�����1g@qfvfebIQ&W� #.�      �   _  x�M�KN�0�דS�	P�a;Y�E�X�%KIժ��TjoŞ���d͗o~�GV�a�b��F
@O���U*����	!���Q	|AM���՘���@��8Xm7Yj�,c��y�ԛ��7�SEt��x�]��O���sL4ze�gd_��^�C����	�`#�{ְ��	��Z0A����i`axψW+sNe�����zJ�iv>{���<��4��I�]�hI�����4��GJ���b�^��A�P]�),�����N҄$S�o*��uoE=rz)��V�0^��<��`K�HM�
$i�5R�Za�����[1(�J��_�� N��      �      x������ � �      �      x������ � �      �   J   x���� ���a���hw��s4�1d8�	�95Q��K^]8z��Ȕ�8�Y���y#�A,"���I?F��      �   J   x�3��MM����Qp��/�L�4�2��'Ve��&�$�d��2Ήyى@�F\�p1ǜ�ļ��lNc�=... 4��      �      x������ � �      �      x������ � �      �   m   x���K
�@е�����<�i��E7�	ٔ�޿&7H��C���]7U���+L�}��.,��HL�f���E:Swx��m�qў�4���i��gu�#��E|����*�      �      x������ � �      �      x������ � �      �      x������ � �     