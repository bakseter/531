CREATE TABLE IF NOT EXISTS base_weights_modifier
(
    email   TEXT,
    "cycle" INT,
    dl      REAL NOT NULL,
    bp      REAL NOT NULL,
    sq      REAL NOT NULL,
    op      REAL NOT NULL,
    CONSTRAINT pk_base_weights_modifier PRIMARY KEY (email, "cycle")
)
