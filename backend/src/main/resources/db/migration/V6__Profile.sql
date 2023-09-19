ALTER TABLE joker
    ADD COLUMN "profile" INT NOT NULL DEFAULT 1;
ALTER TABLE joker
    DROP CONSTRAINT fk_joker_email_cycle_week_day__email_cycle_week_day;
ALTER TABLE joker
    DROP CONSTRAINT pk_joker;
ALTER TABLE joker
    ADD CONSTRAINT pk_joker
        PRIMARY KEY ("email", "profile", "cycle", "week", "day", "num");

ALTER TABLE base_weights
    ADD COLUMN "profile" INT NOT NULL DEFAULT 1;
ALTER TABLE base_weights
    DROP CONSTRAINT base_weights_pkey;
ALTER TABLE base_weights
    ADD CONSTRAINT base_weights_pkey
        PRIMARY KEY ("email", "profile");

ALTER TABLE workout
    ADD COLUMN "profile" INT NOT NULL DEFAULT 1;
ALTER TABLE workout
    DROP CONSTRAINT pk_workout;
ALTER TABLE workout
    ADD CONSTRAINT pk_workout
        PRIMARY KEY ("email", "profile", "cycle", "week", "day");

ALTER TABLE base_weights_modifier
    ADD COLUMN "profile" INT NOT NULL DEFAULT 1;
ALTER TABLE base_weights_modifier
    DROP CONSTRAINT pk_base_weights_modifier;
ALTER TABLE base_weights_modifier
    ADD CONSTRAINT pk_base_weights_modifier
        PRIMARY KEY ("email", "profile", "cycle");

ALTER TABLE joker
    ADD CONSTRAINT fk_joker_email_profile_cycle_week_day__email_profile_cycle_week_day
        FOREIGN KEY ("email", "profile", "cycle", "week", "day")
        REFERENCES workout("email", "profile", "cycle", "week", "day")
        ON UPDATE RESTRICT
        ON DELETE RESTRICT;
