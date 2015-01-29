drop table appuser;
drop table ww_appuser_stats;

create table appuser (
	id BIGSERIAL PRIMARY KEY ON DELETE CASCADE,
	name VARCHAR(20) NOT NULL UNIQUE,
	password VARCHAR(50) NOT NULL,
	email VARCHAR(50) NOT NULL UNIQUE,
	joindate TIMESTAMP NOT NULL,
	validated BOOLEAN NOT NULL,
	lastlogin TIMESTAMP NOT NULL;
);

CREATE TABLE ww_appuser_stats (
	userid INT PRIMARY KEY REFERENCES appuser.id,
	score INT NOT NULL,
	maxlevel INT,
	kills INT,
	deaths INT,
	steps BIGINT
);
