
-- Table: public.access_control_list

-- DROP TABLE public.access_control_list;

CREATE TABLE IF NOT EXISTS public.access_control_list
(
    record_id uuid NOT NULL,
    caregiver_id uuid NOT NULL,
    CONSTRAINT access_control_list_pkey PRIMARY KEY (record_id, caregiver_id)
)

-- Table: public.session_running

-- DROP TABLE public.session_running;

CREATE TABLE IF NOT EXISTS public.session_running
(
    template_session_id uuid NOT NULL,
    session_id uuid NOT NULL,
    caregiver_id uuid NOT NULL,
    patient_id uuid NOT NULL,
    current_image integer,
    CONSTRAINT session_running_pkey PRIMARY KEY (template_session_id, session_id, caregiver_id, patient_id)
)

-- Table: public.template_session

-- DROP TABLE public.template_session;

CREATE TABLE IF NOT EXISTS public.template_session
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    caregiver_id uuid NOT NULL,
    patient_id uuid NOT NULL,
    total_images integer,
    CONSTRAINT template_session_pkey PRIMARY KEY (id),
    CONSTRAINT caregiver_fkey FOREIGN KEY (caregiver_id)
        REFERENCES public.caregiver (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT patient_fkey FOREIGN KEY (patient_id)
        REFERENCES public.patient (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

-- Table: public.template_session_image

-- DROP TABLE public.template_session_image;

CREATE TABLE IF NOT EXISTS public.template_session_image
(
    template_session_id uuid NOT NULL,
    image_id uuid NOT NULL,
    position_image integer NOT NULL,
    CONSTRAINT image_fkey FOREIGN KEY (image_id)
        REFERENCES public.image (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT template_session_fkey FOREIGN KEY (template_session_id)
        REFERENCES public.template_session (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

-- Table Modification: public.session

-- DROP TABLE public.session;

ALTER TABLE public.session
(
    ADD COLUMN session_finished boolean NOT NULL,
    ADD COLUMN duration time without time zone,
    ADD COLUMN total_images integer,
    ADD COLUMN current_image integer,
    ADD COLUMN patient_feedback integer
)


-- Table Modification: public.session_feedback

-- DROP TABLE public.session_feedback;

ALTER TABLE public.session_feedback
(
    ADD COLUMN patient_feedback integer,
    ADD COLUMN patient_agressivity integer,
    ADD COLUMN patient_sadness integer,
    ADD COLUMN patient_isolation integer,
    ADD COLUMN patient_observation VARCHAR,
    CONSTRAINT session_id_unique UNIQUE (session_id)
)

-- Table Modification: public.session_image

-- DROP TABLE public.session_image;

ALTER TABLE public.session_image
(
    ADD COLUMN position_image integer,
    ADD COLUMN patient_feedback integer,
    ADD COLUMN patient_agressivity integer,
    ADD COLUMN patient_sadness integer,
    ADD COLUMN patient_isolation integer
)
