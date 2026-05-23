--
-- PostgreSQL database dump
--

\restrict pAgbPTeDDUTnvA5idYppJmMwgCGY73ast5SOSC1zJM7uukLXsJEN28dexKm8Foc

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Accident; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Accident" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "userId" text NOT NULL,
    "fullName" text NOT NULL,
    "lastName" text NOT NULL,
    "locationLat" numeric(65,30) NOT NULL,
    "locationLng" numeric(65,30) NOT NULL,
    "addressText" text NOT NULL,
    "accidentType" text NOT NULL,
    "sceneData" jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Accident" OWNER TO postgres;

--
-- Name: AccidentPhoto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AccidentPhoto" (
    id text NOT NULL,
    "accidentId" text NOT NULL,
    url text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AccidentPhoto" OWNER TO postgres;

--
-- Name: PasswordResetToken; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PasswordResetToken" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "tokenHash" text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    used boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."PasswordResetToken" OWNER TO postgres;

--
-- Name: Tenant; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Tenant" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Tenant" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    email text NOT NULL,
    "passwordHash" text,
    role text DEFAULT 'USER'::text NOT NULL,
    "firstName" text,
    "lastName" text,
    "vehiclePlate" text,
    "vehicleBrand" text,
    "vehicleModel" text,
    "vehicleYear" integer,
    "isFirstLogin" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: Accident; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Accident" (id, "tenantId", "userId", "fullName", "lastName", "locationLat", "locationLng", "addressText", "accidentType", "sceneData", "createdAt") FROM stdin;
6aae7fb4-4881-416f-b4ed-a430261d0604	d32cfc68-9737-4c73-ad88-5e2da93e8dfc	a19bfca3-2767-4377-8b56-fa4fce738184	a	a	42.229922944181080000000000000000	-8.711255856844998000000000000000	Travesía Couto Piñeiro, 3, Sárdoma, 36204 Vigo, Pontevedra, Espanha	colisao	{"elements": [{"x": 218, "y": 84, "id": "el-1779208587880", "type": "car", "color": "#3b82f6", "width": 40, "height": 40, "rotation": 0}, {"x": 158, "y": 69, "id": "el-1779208591343", "type": "truck", "color": "#60a5fa", "width": 40, "height": 40, "rotation": 0}, {"x": 118, "y": 106, "id": "el-1779208591670", "type": "cone", "color": "#f97316", "width": 40, "height": 40, "rotation": 0}], "background": "road_straight"}	2026-05-19 16:36:59.758
926ef1d7-190e-4aee-b993-1d54bebb1416	d32cfc68-9737-4c73-ad88-5e2da93e8dfc	a19bfca3-2767-4377-8b56-fa4fce738184	a	a	42.229932305671120000000000000000	-8.711251941151337000000000000000	Travesía Couto Piñeiro, 3, Sárdoma, 36204 Vigo, Pontevedra, Espanha	colisao	{"elements": [{"x": 135.15977478027344, "y": 266.49493408203125, "id": "el-1779354439700-2ssxztp9y", "type": "car", "color": "#3b82f6", "width": 40, "height": 20, "flipped": false, "rotation": 0}, {"x": 77.4278335571289, "y": 267.5257568359375, "id": "el-1779354442242-6n22qqbed", "type": "truck", "color": "#eab308", "width": 60, "height": 25, "flipped": false, "rotation": 0}, {"x": 62.994842529296875, "y": 187.1134033203125, "id": "el-1779354444828-lpgs2i1f2", "type": "stop_sign", "color": "#60a5fa", "width": 40, "height": 40, "flipped": false, "rotation": 0}, {"x": 239.28350830078125, "y": 239.69073486328125, "id": "el-1779354445904-6yu4dk9xg", "type": "traffic_light_red", "color": "#60a5fa", "width": 18, "height": 60, "flipped": false, "rotation": 0}, {"x": 100.10824584960938, "y": 286.08251953125, "id": "el-1779354450130-4zt3o2xhi", "type": "damage_light", "color": "#ef4444", "width": 30, "height": 30, "flipped": false, "rotation": 0}, {"x": 58.87113952636719, "y": 189.17535400390625, "id": "el-1779354450681-7b0yecadg", "type": "damage_moderate", "color": "#ef4444", "width": 30, "height": 30, "flipped": false, "rotation": 0}, {"x": 152.68557739257812, "y": 279.89691162109375, "id": "el-1779354452188-nwritio23", "type": "damage_severe", "color": "#ef4444", "width": 30, "height": 30, "flipped": false, "rotation": 0}, {"x": 1.1391716003417969, "y": 127.31964111328125, "id": "el-1779354455476-ptov4yku3", "type": "rain_stroke", "color": "#60a5fa", "width": 40, "height": 40, "flipped": false, "rotation": 0}], "background": "road_straight"}	2026-05-21 09:08:29.872
651e91e2-ce7c-4c8a-b947-c6ea49b58f17	d32cfc68-9737-4c73-ad88-5e2da93e8dfc	a19bfca3-2767-4377-8b56-fa4fce738184	a	a	42.229879009266290000000000000000	-8.711272086842261000000000000000	Travesía Couto Piñeiro, 3, Sárdoma, 36204 Vigo, Pontevedra, Espanha	colisao	{"elements": [{"x": 78.77263210947754, "y": 36.812591675183604, "id": "el-1779295700130", "type": "truck", "color": "#60a5fa", "width": 40, "height": 40, "rotation": 0}, {"x": 214.0014143250984, "y": 53.27624571788174, "id": "el-1779295700463", "type": "car", "color": "#3b82f6", "width": 40, "height": 40, "rotation": 0}, {"x": 238.77614500400603, "y": 62.53694450753274, "id": "el-1779295717684", "type": "damage_light", "color": "#60a5fa", "width": 30, "height": 30, "rotation": 0}, {"x": 107.6764922076089, "y": 44.01542508895451, "id": "el-1779295724801", "type": "damage_severe", "color": "#60a5fa", "width": 30, "height": 30, "rotation": 0}, {"x": 159.2905259144418, "y": 127.3625061511091, "id": "el-1779295732987", "type": "water", "color": "#60a5fa", "width": 40, "height": 40, "rotation": 0}, {"x": 12.706683632390607, "y": 111.92790663562724, "id": "el-1779295737335", "type": "crosswalk", "color": "#60a5fa", "width": 40, "height": 40, "rotation": 0}], "background": "road_oneway"}	2026-05-20 16:50:43.563
a5e32800-5da7-4475-8fa9-e195060c716c	d32cfc68-9737-4c73-ad88-5e2da93e8dfc	a19bfca3-2767-4377-8b56-fa4fce738184	a	a	42.229923735209080000000000000000	-8.711254170726590000000000000000	Travesía Couto Piñeiro, 3, Sárdoma, 36204 Vigo, Pontevedra, Espanha	colisao	{"elements": [{"x": 177.42784118652344, "y": 246.9072265625, "id": "el-1779354912682-li0gfccme", "type": "car", "color": "#3b82f6", "width": 40, "height": 20, "flipped": false, "rotation": 0}, {"x": 133.0979461669922, "y": 245.87628173828125, "id": "el-1779354913344-sldezfjm5", "type": "truck", "color": "#eab308", "width": 60, "height": 25, "flipped": false, "rotation": 0}, {"x": 67.11855697631836, "y": 287.1134033203125, "id": "el-1779354914309-wtpa5cv05", "type": "stop_sign", "color": "#60a5fa", "width": 40, "height": 40, "flipped": false, "rotation": 0}, {"x": 146.5, "y": 261.3402099609375, "id": "el-1779354917814-924a930ul", "type": "damage_light", "color": "#ef4444", "width": 30, "height": 30, "flipped": false, "rotation": 0}, {"x": 61.96391296386719, "y": 286.08251953125, "id": "el-1779354918721-iaajv9g85", "type": "damage_moderate", "color": "#ef4444", "width": 30, "height": 30, "flipped": false, "rotation": 0}, {"x": 200.10823822021484, "y": 265.46392822265625, "id": "el-1779354919090-5yz43vukn", "type": "damage_severe", "color": "#ef4444", "width": 30, "height": 30, "flipped": false, "rotation": 0}, {"x": 239.2834930419922, "y": 133.505126953125, "id": "el-1779354919762-oiwbj0u1w", "type": "traffic_light_red", "color": "#60a5fa", "width": 18, "height": 60, "flipped": false, "rotation": 0}, {"x": 68.14949798583984, "y": 120.10302734375, "id": "el-1779354921519-pysydpkre", "type": "sun", "color": "#60a5fa", "width": 40, "height": 40, "flipped": false, "rotation": 0}], "background": "road_straight"}	2026-05-21 09:16:34.975
01282cec-6fc9-4582-859b-589fb6362b95	d32cfc68-9737-4c73-ad88-5e2da93e8dfc	a19bfca3-2767-4377-8b56-fa4fce738184	a	a	42.229978631167890000000000000000	-8.711242747680322000000000000000	Travesía Couto Piñeiro, 4, Sárdoma, 36204 Vigo, Pontevedra, Espanha	colisao	{"elements": [{"x": 158.8711395263672, "y": 255.1546630859375, "id": "el-1779355173724-xg3ryzfi9", "type": "car", "color": "#3b82f6", "width": 40, "height": 20, "flipped": false, "rotation": 0}, {"x": 114.5412368774414, "y": 250, "id": "el-1779355174099-4swwap228", "type": "truck", "color": "#eab308", "width": 60, "height": 25, "flipped": false, "rotation": 0}, {"x": 85.67525482177734, "y": 350, "id": "el-1779355174427-n2qe5e3ke", "type": "pedestrian", "color": "#60a5fa", "width": 40, "height": 40, "flipped": false, "rotation": 0}, {"x": 248.56185150146484, "y": 250.00006103515625, "id": "el-1779355179687-btg8p7ih7", "type": "stop_sign", "color": "#60a5fa", "width": 40, "height": 40, "flipped": false, "rotation": 0}, {"x": 217.63401794433594, "y": 169.587646484375, "id": "el-1779355180228-a2p2ueux9", "type": "traffic_light_red", "color": "#60a5fa", "width": 18, "height": 60, "flipped": false, "rotation": 0}, {"x": 123.819580078125, "y": 261.3402099609375, "id": "el-1779355181401-az0yt5c5a", "type": "damage_light", "color": "#ef4444", "width": 30, "height": 30, "flipped": false, "rotation": 0}, {"x": 242.3762969970703, "y": 247.9381103515625, "id": "el-1779355181803-j3qaq59ze", "type": "damage_moderate", "color": "#ef4444", "width": 30, "height": 30, "flipped": false, "rotation": 0}, {"x": 181.55154418945312, "y": 272.680419921875, "id": "el-1779355182185-4bpwuhwx4", "type": "damage_severe", "color": "#ef4444", "width": 30, "height": 30, "flipped": false, "rotation": 0}, {"x": 13.51031494140625, "y": 98.45361328125, "id": "el-1779355184043-tz22z6g92", "type": "rain_stroke", "color": "#60a5fa", "width": 40, "height": 40, "flipped": false, "rotation": 0}], "background": "road_straight"}	2026-05-21 09:20:24.523
de1d3bdf-c27a-4179-856d-0adc6e26fcb0	d32cfc68-9737-4c73-ad88-5e2da93e8dfc	a19bfca3-2767-4377-8b56-fa4fce738184	Gustavo	Ferreira	42.229924275351750000000000000000	-8.711258917547569000000000000000	Travesía Couto Piñeiro, 3, Sárdoma, 36204 Vigo, Pontevedra, Espanha	capotamento	{"elements": [{"x": 146.5, "y": 250, "id": "el-1779462254184-n33b0zxlo", "type": "car", "color": "#3b82f6", "width": 40, "height": 20, "flipped": false, "rotation": 0}, {"x": 146.5, "y": 250, "id": "el-1779462254484-jmkjsvvc5", "type": "truck", "color": "#eab308", "width": 60, "height": 25, "flipped": false, "rotation": 0}, {"x": 146.5, "y": 250, "id": "el-1779462254804-cb9wls3iz", "type": "stop_sign", "color": "#60a5fa", "width": 40, "height": 40, "flipped": false, "rotation": 0}, {"x": 146.5, "y": 250, "id": "el-1779462255155-7eoxq8eo6", "type": "traffic_light_red", "color": "#60a5fa", "width": 18, "height": 60, "flipped": false, "rotation": 0}, {"x": 146.5, "y": 250, "id": "el-1779462255461-xibah13ef", "type": "traffic_light_yellow", "color": "#60a5fa", "width": 18, "height": 60, "flipped": false, "rotation": 0}, {"x": 146.5, "y": 250, "id": "el-1779462256588-bm2nbbvdj", "type": "water", "color": "#60a5fa", "width": 40, "height": 40, "flipped": false, "rotation": 0}, {"x": 146.5, "y": 250, "id": "el-1779462256843-0jni7m4sg", "type": "pothole", "color": "#60a5fa", "width": 40, "height": 40, "flipped": false, "rotation": 0}, {"x": 146.5, "y": 250, "id": "el-1779462257154-1wm1z8c3j", "type": "damage_moderate", "color": "#ef4444", "width": 30, "height": 30, "flipped": false, "rotation": 0}, {"x": 146.5, "y": 250, "id": "el-1779462257980-gtoi4hvnw", "type": "sun", "color": "#60a5fa", "width": 40, "height": 40, "flipped": false, "rotation": 0}], "background": "road_straight"}	2026-05-22 15:04:19.237
ff0321c9-4c67-48f8-bec6-68085b1a94ca	d32cfc68-9737-4c73-ad88-5e2da93e8dfc	fc154c7e-8ad4-405f-9391-fdfaaf7942ab	Gustavo	Ferreira	42.229928358095350000000000000000	-8.711291456501003000000000000000	Rúa Couto Piñeiro 6, Vigo, Espanha	capotamento	{"elements": [{"x": 468, "y": 303, "id": "el-1779487538097-61qc9o5ld", "type": "car", "color": "#3b82f6", "width": 40, "height": 20, "flipped": false, "rotation": 0}, {"x": 371, "y": 322, "id": "el-1779487538530-nv7pyohsd", "type": "truck", "color": "#eab308", "width": 60, "height": 25, "flipped": false, "rotation": 0}, {"x": 286, "y": 215, "id": "el-1779487539792-q7ab9rpzv", "type": "stop_sign", "color": "#60a5fa", "width": 40, "height": 40, "flipped": false, "rotation": 0}, {"x": 415, "y": 241, "id": "el-1779487540675-y4dt9grd2", "type": "traffic_light_red", "color": "#60a5fa", "width": 18, "height": 60, "flipped": false, "rotation": 0}, {"x": 487, "y": 315, "id": "el-1779487542563-0m19yqz9a", "type": "damage_moderate", "color": "#ef4444", "width": 30, "height": 30, "flipped": false, "rotation": 0}, {"x": 378, "y": 332, "id": "el-1779487543036-maskp6vm1", "type": "damage_severe", "color": "#ef4444", "width": 30, "height": 30, "flipped": false, "rotation": 0}, {"x": 361, "y": 417, "id": "el-1779487544483-v71oi1viq", "type": "water", "color": "#60a5fa", "width": 40, "height": 40, "flipped": false, "rotation": 0}, {"x": 221, "y": 72, "id": "el-1779487545105-74k7p17ru", "type": "rain_stroke", "color": "#60a5fa", "width": 40, "height": 40, "flipped": false, "rotation": 0}], "background": "road_straight"}	2026-05-22 22:06:20.511
\.


--
-- Data for Name: AccidentPhoto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AccidentPhoto" (id, "accidentId", url, "createdAt") FROM stdin;
5b35a21a-586f-4c4b-a523-a7c36ce45b0c	6aae7fb4-4881-416f-b4ed-a430261d0604	https://toseguro-storage-prod.s3.eu-north-1.amazonaws.com/accidents/1779208583698-whatsapp_image_2026_05_13_at_15.27.26.jpeg	2026-05-19 16:36:59.903
eef392a0-e7ca-4641-a447-2f906db4c1dc	de1d3bdf-c27a-4179-856d-0adc6e26fcb0	https://toseguro-storage-prod.s3.eu-north-1.amazonaws.com/accidents/1779462239254-whatsapp_image_2026_05_13_at_15.27.26.jpeg	2026-05-22 15:04:19.51
bc1c021c-ee50-4d57-9c7d-6f287bde6a14	ff0321c9-4c67-48f8-bec6-68085b1a94ca	https://toseguro-storage-prod.s3.eu-north-1.amazonaws.com/accidents/1779487530381-whatsapp_image_2026_05_13_at_15.27.26.jpeg	2026-05-22 22:06:20.601
\.


--
-- Data for Name: PasswordResetToken; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PasswordResetToken" (id, "userId", "tokenHash", "expiresAt", used, "createdAt") FROM stdin;
\.


--
-- Data for Name: Tenant; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Tenant" (id, name, slug, "createdAt") FROM stdin;
d32cfc68-9737-4c73-ad88-5e2da93e8dfc	ACME Corporation Admin	acme	2026-05-18 22:11:41.952
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, "tenantId", email, "passwordHash", role, "firstName", "lastName", "vehiclePlate", "vehicleBrand", "vehicleModel", "vehicleYear", "isFirstLogin", "createdAt") FROM stdin;
a72c2fc1-842f-4ff7-85ee-29f5b5020a1f	d32cfc68-9737-4c73-ad88-5e2da93e8dfc	trogist15496@gmail.com	$2b$10$7RF2xLn3g3WUdxYful9RU.hh60UDAOa.qOtrPFTi6GTPF/iWvpOma	ADMIN	Gustavo	Admin	\N	\N	\N	\N	f	2026-05-18 22:11:41.952
a19bfca3-2767-4377-8b56-fa4fce738184	d32cfc68-9737-4c73-ad88-5e2da93e8dfc	sonicrj15496@gmail.com	$2b$12$fRFWKmgxoiHlTae9swSryuc91auAHNhW8ldNhBXKCy7iqZ.rLZ7qO	USER	Gustavo	Ferreira	\N	\N	\N	\N	t	2026-05-19 09:41:53.62
fc154c7e-8ad4-405f-9391-fdfaaf7942ab	d32cfc68-9737-4c73-ad88-5e2da93e8dfc	b3rnas0@gmail.com	$2b$10$VPcviN2SBq3x/N5.XKnFCeVcqnsXGOZ4qgLIUhY6j/WTyP0Xkth0C	USER	Gustavo	Ferreira	\N	\N	\N	\N	t	2026-05-22 22:05:04.582
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
e18b670c-12a3-4f90-b7b1-ccfb62021c92	fae65af73882eed3af878bb8ef5987376104242a0f81e024021ded9053969bc3	2026-05-18 15:38:29.877913+02	20260518133829_init_schema	\N	\N	2026-05-18 15:38:29.726315+02	1
\.


--
-- Name: AccidentPhoto AccidentPhoto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AccidentPhoto"
    ADD CONSTRAINT "AccidentPhoto_pkey" PRIMARY KEY (id);


--
-- Name: Accident Accident_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Accident"
    ADD CONSTRAINT "Accident_pkey" PRIMARY KEY (id);


--
-- Name: PasswordResetToken PasswordResetToken_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PasswordResetToken"
    ADD CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY (id);


--
-- Name: Tenant Tenant_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tenant"
    ADD CONSTRAINT "Tenant_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: PasswordResetToken_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PasswordResetToken_userId_key" ON public."PasswordResetToken" USING btree ("userId");


--
-- Name: Tenant_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Tenant_slug_key" ON public."Tenant" USING btree (slug);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: AccidentPhoto AccidentPhoto_accidentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AccidentPhoto"
    ADD CONSTRAINT "AccidentPhoto_accidentId_fkey" FOREIGN KEY ("accidentId") REFERENCES public."Accident"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Accident Accident_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Accident"
    ADD CONSTRAINT "Accident_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Accident Accident_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Accident"
    ADD CONSTRAINT "Accident_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PasswordResetToken PasswordResetToken_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PasswordResetToken"
    ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: User User_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict pAgbPTeDDUTnvA5idYppJmMwgCGY73ast5SOSC1zJM7uukLXsJEN28dexKm8Foc

