drop table userdata;
drop table userstats;

create table userdata (
	userid BIGSERIAL PRIMARY KEY ON DELETE CASCADE,
	username VARCHAR(20) NOT NULL UNIQUE,
	password VARCHAR(50) NOT NULL,
	email VARCHAR(50) NOT NULL,
	joindate TIMESTAMP NOT NULL,
	validated BOOLEAN NOT NULL,
	lastlogin TIMESTAMP NOT NULL;
);

CREATE TABLE userstats (
	userid INT PRIMARY KEY REFERENCES userdata.userid,
	score INT NOT NULL,
	maxlevel INT,
	kills INT,
	deaths INT,
	steps BIGINT
);
