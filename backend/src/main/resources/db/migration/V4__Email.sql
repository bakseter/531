ALTER TABLE joker
    ADD COLUMN "email" TEXT NOT NULL DEFAULT 'andreas_tkd@hotmail.com';
ALTER TABLE joker
    DROP CONSTRAINT fk_joker_cycle_week_day__cycle_week_day;
ALTER TABLE joker
    ADD CONSTRAINT pk_joker
        PRIMARY KEY ("email", "cycle", "week", "day", "num");

ALTER TABLE workout
    ADD COLUMN "email" TEXT NOT NULL DEFAULT 'andreas_tkd@hotmail.com';
ALTER TABLE workout
    DROP CONSTRAINT pk_workout;
ALTER TABLE workout
    ADD constraint pk_workout
        PRIMARY KEY ("email", "cycle", "week", "day");

ALTER TABLE base_weights
    ADD COLUMN email TEXT NOT NULL DEFAULT 'andreas_tkd@hotmail.com';
ALTER TABLE base_weights
    DROP CONSTRAINT pk_base_weights;
ALTER TABLE base_weights
    ADD CONSTRAINT pk_base_weights
        PRIMARY KEY("email");

ALTER TABLE joker
    ADD CONSTRAINT fk_joker_email_cycle_week_day__email_cycle_week_day
        FOREIGN KEY ("email", "cycle", "week", "day")
        REFERENCES workout("email", "cycle", "week", "day")
        ON UPDATE RESTRICT
        ON DELETE RESTRICT;
