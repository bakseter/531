ALTER TABLE workout
    ADD COLUMN "date" TIMESTAMP WITHOUT TIME ZONE NULL;

ALTER TABLE workout
    ALTER COLUMN reps
    SET DEFAULT 0;
