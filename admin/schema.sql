DROP TABLE appuser;
DROP TABLE ww_appuser_stats;

CREATE TABLE appuser (
	id BIGSERIAL PRIMARY KEY ON DELETE CASCADE,
	name VARCHAR(20) NOT NULL UNIQUE,
	email VARCHAR(50) NOT NULL UNIQUE,
	joindate TIMESTAMP NOT NULL,
	validated BOOLEAN NOT NULL,
	lastlogin TIMESTAMP NOT NULL;
);

CREATE TABLE appuser_passwords (
	userid BIGINT PRIMARY KEY REFERENCES appuser.id,
	password VARCHAR(50) NOT NULL
);

CREATE TABLE ww_appuser_stats (
	userid BIGINT PRIMARY KEY REFERENCES appuser.id,
	score INT NOT NULL,
	maxlevel INT,
	kills INT,
	deaths INT,
	steps BIGINT
);
