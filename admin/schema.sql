DROP TABLE appuser;
DROP TABLE appuser_passwords;
DROP TABLE ww_appuser_stats;


CREATE TABLE appuser_passwords (
	userid 		BIGINT UNIQUE,
	password 	VARCHAR(50) 	NOT NULL,
	PRIMARY KEY (userid)
);

CREATE TABLE ww_appuser_stats (
	userid 		BIGINT,
	gameid	 	INT,
	score 		INT 	NOT NULL,
	maxlevel 	INT,
	kills 		INT,
	deaths 		INT,
	steps 		BIGINT,
	PRIMARY KEY (userid, gameid)
);

CREATE TABLE appuser (
	id 		BIGSERIAL,
	name 		VARCHAR(20) 	NOT NULL 	UNIQUE,
	email 		VARCHAR(50) 	NOT NULL 	UNIQUE,
	joindate 	TIMESTAMP 	NOT NULL,
	validated 	BOOLEAN 	NOT NULL,
	lastlogin 	TIMESTAMP 	NOT NULL,
	highscore	INT		NOT NULL,
	PRIMARY KEY (id)
);
