-----------------------EXTENSIONS----------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-----------------------PRIMARY ENTITIES TABLES---------------------------
CREATE TABLE "caregiver" (
	"id" UUID NOT NULL DEFAULT uuid_generate_v4(),
	CONSTRAINT caregiver_pkey PRIMARY KEY (id),
	"name" VARCHAR NOT NULL,
	"email" VARCHAR NOT NULL UNIQUE,
	"phone" VARCHAR,
	"password" VARCHAR NOT NULL,
	"birth_date" DATE NOT NULL,
	"type" VARCHAR NOT NULL,
	"speciality" VARCHAR,
	"is_active" BOOLEAN DEFAULT TRUE,
	"created_date" TIMESTAMP NOT NULL,
	"last_updated_date" TIMESTAMP NOT NULL,
	"last_login_date" TIMESTAMP NOT NULL
);

CREATE TABLE "patient" (
	"id" UUID NOT NULL DEFAULT uuid_generate_v4(),
	CONSTRAINT patient_pkey PRIMARY KEY (id),
	"name" VARCHAR NOT NULL,
	"display_name" VARCHAR,
	"birth_date" DATE NOT NULL,
	"education" VARCHAR NOT NULL,
	"is_active" BOOLEAN DEFAULT TRUE,
	"created_date" TIMESTAMP NOT NULL,
	"last_updated_date" TIMESTAMP NOT NULL,
	"interests" VARCHAR,
	"cities" VARCHAR
);

CREATE TABLE "image" (
	"id" UUID NOT NULL DEFAULT uuid_generate_v4(),
	CONSTRAINT image_pkey PRIMARY KEY (id),
	"created_by_id" UUID NOT NULL,
	CONSTRAINT caregiver_fkey FOREIGN KEY (created_by_id) REFERENCES caregiver(id),
	"category" VARCHAR NOT NULL,
	"description" VARCHAR NOT NULL,
	"is_personal" BOOLEAN DEFAULT TRUE,
	"is_private" BOOLEAN DEFAULT TRUE,
	"image_path" VARCHAR NOT NULL,
	"negative_intensity" REAL NOT NULL,
	"neutral_intensity" REAL NOT NULL,
	"positive_intensity" REAL NOT NULL,
	"created_date" TIMESTAMP NOT NULL,
	"last_updated_date" TIMESTAMP NOT NULL
);

CREATE TABLE "thumbnail" (
	"id" UUID NOT NULL DEFAULT uuid_generate_v4(),
	CONSTRAINT thumbnail_pkey PRIMARY KEY (id),
	"image_id" UUID NOT NULL,
	CONSTRAINT image_fkey FOREIGN KEY (image_id) REFERENCES image(id),
	"image_path" VARCHAR NOT NULL
);

CREATE TABLE "tag" (
	"id" UUID NOT NULL DEFAULT uuid_generate_v4(),
	CONSTRAINT tag_pkey PRIMARY KEY (id),
	"description" VARCHAR NOT NULL
);

CREATE TABLE "request" (
	"id" UUID NOT NULL DEFAULT uuid_generate_v4(),
	CONSTRAINT request_pkey PRIMARY KEY (id),
	"caregiver_id" UUID NOT NULL,
	CONSTRAINT caregiver_fkey FOREIGN KEY (caregiver_id) REFERENCES caregiver(id),
	"target_id" VARCHAR,
	"expiration_date" TIMESTAMP NOT NULL
);

CREATE TABLE "image_to_validate" (
	"id" UUID NOT NULL DEFAULT uuid_generate_v4(),
	CONSTRAINT image_to_validate_pkey PRIMARY KEY (id),
	"caregiver_id" UUID NOT NULL,
	CONSTRAINT caregiver_fkey FOREIGN KEY (caregiver_id) REFERENCES caregiver(id),
	"target_id" VARCHAR,
	"category" VARCHAR NOT NULL,
	"description" VARCHAR NOT NULL,
	"image_path" VARCHAR NOT NULL,
	"submission_date" TIMESTAMP NOT NULL,
	"username" VARCHAR NOT NULL,
	"is_private" BOOLEAN DEFAULT TRUE
);

-----------------------RELATION TABLES----------------------------------
CREATE TABLE "caregiver_patient" (
	"caregiver_id" UUID NOT NULL,
	CONSTRAINT caregiver_fkey FOREIGN KEY (caregiver_id) REFERENCES caregiver(id),
	"patient_id" UUID NOT NULL,
	CONSTRAINT patient_fkey FOREIGN KEY (patient_id) REFERENCES patient(id),
	"is_primary" BOOLEAN DEFAULT TRUE,
	"patient_relation" VARCHAR
);

CREATE TABLE "caregiver_notification" (
	"id" UUID NOT NULL DEFAULT uuid_generate_v4(),
	CONSTRAINT notification_pkey PRIMARY KEY (id),
	"sender_email" VARCHAR NOT NULL,
	CONSTRAINT sender_email_fkey FOREIGN KEY (sender_email) REFERENCES caregiver(email),
	"receiver_email" VARCHAR NOT NULL,
	CONSTRAINT receiver_email_fkey FOREIGN KEY (receiver_email) REFERENCES caregiver(email),
	"patient_id" UUID NOT NULL,
	CONSTRAINT patient_id_fkey FOREIGN KEY (patient_id) REFERENCES patient(id),
	"message_type" VARCHAR NOT NULL,
	"created_date" TIMESTAMP NOT NULL
);

CREATE TABLE "patient_chat" (
	"id" UUID NOT NULL DEFAULT uuid_generate_v4(),
	CONSTRAINT patient_chat_pkey PRIMARY KEY (id),
	"patient_id" UUID NOT NULL,
	CONSTRAINT patient_fkey FOREIGN KEY (patient_id) REFERENCES patient(id),
	"last_message_sent_date" TIMESTAMP NOT NULL
);

CREATE TABLE "patient_chat_message" (
	"id" UUID NOT NULL DEFAULT uuid_generate_v4(),
	CONSTRAINT patient_chat_message_pkey PRIMARY KEY (id),
	"patient_chat_id" UUID NOT NULL,
	CONSTRAINT patient_chat_fkey FOREIGN KEY (patient_chat_id) REFERENCES patient_chat(id),
	"created_by_id" UUID NOT NULL,
	CONSTRAINT caregiver_fkey FOREIGN KEY (created_by_id) REFERENCES caregiver(id),
	"message" VARCHAR NOT NULL,
	"created_date" TIMESTAMP NOT NULL
);

CREATE TABLE "caregiver_patient_chat" (
	"caregiver_id" UUID NOT NULL DEFAULT uuid_generate_v4(),
	CONSTRAINT caregiver_fkey FOREIGN KEY (caregiver_id) REFERENCES caregiver(id),
	"patient_chat_id" UUID NOT NULL,
	CONSTRAINT patient_chat_fkey FOREIGN KEY (patient_chat_id) REFERENCES patient_chat(id),
	"last_message_read_date" TIMESTAMP NOT NULL
);

CREATE TABLE "patient_observation" (
	"id" UUID NOT NULL DEFAULT uuid_generate_v4(),
	CONSTRAINT patient_observation_pkey PRIMARY KEY (id),
	"patient_id" UUID NOT NULL,
	CONSTRAINT patient_fkey FOREIGN KEY (patient_id) REFERENCES patient(id),
	"caregiver_id" UUID NOT NULL,
	CONSTRAINT caregiver_fkey FOREIGN KEY (caregiver_id) REFERENCES caregiver(id),
	"observation" VARCHAR NOT NULL,
	"last_updated_date" TIMESTAMP NOT NULL
);

CREATE TABLE "session" (
	"id" UUID NOT NULL DEFAULT uuid_generate_v4(),
	CONSTRAINT session_pkey PRIMARY KEY (id),
	"caregiver_id" UUID NOT NULL,
	CONSTRAINT caregiver_fkey FOREIGN KEY (caregiver_id) REFERENCES caregiver(id),
	"patient_id" UUID NOT NULL,
	CONSTRAINT patient_fkey FOREIGN KEY (patient_id) REFERENCES patient(id),
	"start_session_date" TIMESTAMP NOT NULL,
	"end_session_date" TIMESTAMP,
	"session_finished" boolean NOT NULL,
    "duration" time without time zone,
    "total_images" integer,
    "current_image" integer,
    "patient_feedback" integer
);

CREATE TABLE "session_feedback" (
	"id" UUID NOT NULL DEFAULT uuid_generate_v4(),
	CONSTRAINT session_feedback_pkey PRIMARY KEY (id),
	"session_id" UUID NOT NULL,
	CONSTRAINT session_fkey FOREIGN KEY (session_id) REFERENCES session(id),
	"feedback" VARCHAR,
	"created_by" VARCHAR NOT NULL,
	"created_date" TIMESTAMP NOT NULL,
	"patient_feedback" integer,
	"anxiety" integer,
	"agressivity" integer,
	"irritability" integer,
	"commitment" integer,
	"joy" integer,
	"enthusiasm" integer,
	"communication" integer,
	"apathy" integer,
    "patient_agressivity" integer,
    "patient_sadness" integer,
    "patient_isolation" integer,
    "patient_observation" VARCHAR,
    CONSTRAINT session_id_unique UNIQUE (session_id)
);

CREATE TABLE "session_follow_up" (
	"id" UUID NOT NULL DEFAULT uuid_generate_v4(),
	CONSTRAINT session_follow_up_pkey PRIMARY KEY (id),
	"session_id" UUID NOT NULL,
	CONSTRAINT session_fkey FOREIGN KEY (session_id) REFERENCES session(id),
	"follow_up" VARCHAR NOT NULL,
	"created_by" VARCHAR NOT NULL,
	"created_date" TIMESTAMP NOT NULL
);

CREATE TABLE "session_image" (
	"session_id" UUID NOT NULL,
	CONSTRAINT session_fkey FOREIGN KEY (session_id) REFERENCES session(id),
	"image_id" UUID NOT NULL,
	CONSTRAINT image_fkey FOREIGN KEY (image_id) REFERENCES image(id),
	"patient_negative_intensity" REAL,
	"patient_neutral_intensity" REAL,
	"patient_positive_intensity" REAL,
	"observation" VARCHAR,
	"position_image" integer,
    "patient_feedback" integer,
	"anxiety" integer,
	"agressivity" integer,
	"irritability" integer,
	"commitment" integer,
	"joy" integer,
	"enthusiasm" integer,
	"communication" integer,
	"apathy" integer,
    "patient_agressivity" integer,
    "patient_sadness" integer,
    "patient_isolation" integer
);

CREATE TABLE "patient_personal_image" (
	"patient_id" UUID NOT NULL,
	CONSTRAINT patient_fkey FOREIGN KEY (patient_id) REFERENCES patient(id),
	"image_id" UUID NOT NULL,
	CONSTRAINT image_fkey FOREIGN KEY (image_id) REFERENCES image(id),
	"is_favorite" BOOLEAN DEFAULT FALSE
);

CREATE TABLE "patient_image" (
	"patient_id" UUID NOT NULL,
	CONSTRAINT patient_fkey FOREIGN KEY (patient_id) REFERENCES patient(id),
	"image_id" UUID NOT NULL,
	CONSTRAINT image_fkey FOREIGN KEY (image_id) REFERENCES image(id),
	"nr_negative" INTEGER NOT NULL,
	"nr_neutral" INTEGER NOT NULL,
	"nr_positive" INTEGER NOT NULL
);

CREATE TABLE "caregiver_personal_image" (
	"caregiver_id" UUID NOT NULL,
	CONSTRAINT caregiver_fkey FOREIGN KEY (caregiver_id) REFERENCES caregiver(id),
	"image_id" UUID NOT NULL,
	CONSTRAINT image_fkey FOREIGN KEY (image_id) REFERENCES image(id),
	"is_favorite" BOOLEAN DEFAULT FALSE
);

CREATE TABLE "patient_tag" (
	"patient_id" UUID NOT NULL,
	CONSTRAINT patient_fkey FOREIGN KEY (patient_id) REFERENCES patient(id),
	"tag_id" UUID NOT NULL,
	CONSTRAINT tag_fkey FOREIGN KEY (tag_id) REFERENCES tag(id),
	"nr_negative" INTEGER NOT NULL,
	"nr_neutral" INTEGER NOT NULL,
	"nr_positive" INTEGER NOT NULL
);

CREATE TABLE "tag_image" (
	"tag_id" UUID NOT NULL,
	CONSTRAINT tag_fkey FOREIGN KEY (tag_id) REFERENCES tag(id),
	"image_id" UUID NOT NULL,
	CONSTRAINT image_fkey FOREIGN KEY (image_id) REFERENCES image(id)
);

CREATE TABLE "access_control_list" (
	record_id UUID NOT NULL,
    persona_id UUID NOT NULL,
	record_type INTEGER,
	persona_type INTEGER,
    CONSTRAINT access_control_list_pkey PRIMARY KEY (record_id, persona_id)
);

CREATE TABLE "session_running" (
	template_session_id UUID NOT NULL,
    session_id UUID NOT NULL,
    caregiver_id UUID NOT NULL,
    patient_id UUID NOT NULL,
    current_image INTEGER,
    CONSTRAINT session_running_pkey PRIMARY KEY (template_session_id, session_id, caregiver_id, patient_id)
);

CREATE TABLE "template_session" (
	id UUID NOT NULL DEFAULT uuid_generate_v4(),
    caregiver_id UUID NOT NULL,
    patient_id UUID,
    total_images INTEGER,
	categories VARCHAR,
	created_date TIMESTAMP,
	last_updated_date TIMESTAMP,
	template_name VARCHAR,
    CONSTRAINT template_session_pkey PRIMARY KEY (id),
    CONSTRAINT caregiver_fkey FOREIGN KEY (caregiver_id) REFERENCES caregiver(id),
    CONSTRAINT patient_fkey FOREIGN KEY (patient_id) REFERENCES patient(id)
);

CREATE TABLE "template_session_image" (
	template_session_id UUID NOT NULL,
    image_id UUID NOT NULL,
    position_image INTEGER NOT NULL,
    CONSTRAINT image_fkey FOREIGN KEY (image_id) REFERENCES image(id),
    CONSTRAINT template_session_fkey FOREIGN KEY (template_session_id) REFERENCES template_session(id)
);

CREATE TABLE "category" (
	id INTEGER NOT NULL,
    name VARCHAR,
    image_number INTEGER,
    CONSTRAINT category_pkey2 PRIMARY KEY (id)
);

CREATE TABLE "category_translation" (
	id INTEGER NOT NULL,
    name VARCHAR NOT NULL,
    language VARCHAR,
    translation VARCHAR,
    CONSTRAINT category_pkey PRIMARY KEY (id)
);