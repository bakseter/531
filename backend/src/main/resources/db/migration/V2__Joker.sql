CREATE TABLE IF NOT EXISTS joker (
    "cycle" INT NOT NULL,
    week INT NOT NULL,
    "day" INT NOT NULL,
    num INT NOT NULL,

    CONSTRAINT fk_joker_cycle_week_day__cycle_week_day
        FOREIGN KEY ("cycle", week, "day") REFERENCES workout("cycle", week, "day")
            ON DELETE RESTRICT
            ON UPDATE RESTRICT,

    CONSTRAINT valid_week CHECK (week IN (1, 2, 3)),

    CONSTRAINT valid_day CHECK ("day" IN (1, 2, 3, 4))
);