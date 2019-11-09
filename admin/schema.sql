DROP DATABASE IF EXISTS warehousewars_online;
CREATE DATABASE warehousewars_online;
\connect warehousewars_online;

DROP TABLE IF EXISTS appuser CASCADE;
DROP TABLE IF EXISTS appuser_passwords CASCADE;
DROP TABLE IF EXISTS ww_appuser_stats CASCADE;

CREATE TABLE appuser_passwords (
        userid          BIGINT,
        password        VARCHAR(50) NOT NULL,
        PRIMARY KEY (userid)
);

CREATE TABLE ww_appuser_stats (
        gameid          BIGSERIAL,
        userid          BIGINT,
        time            TIMESTAMP,
        score           INT         NOT NULL,
        maxlevel        INT,
        kills           INT,
        deaths          INT,
        steps           BIGINT,
        PRIMARY KEY (gameid)
);

CREATE TABLE appuser (
        id              BIGSERIAL,
        name            VARCHAR(20) NOT NULL UNIQUE,
        email           VARCHAR(50) NOT NULL UNIQUE,
        joindate        TIMESTAMP   NOT NULL,
        validated       BOOLEAN     NOT NULL,
        lastlogin       TIMESTAMP   NOT NULL,
        highscore       INT         NOT NULL,
        PRIMARY KEY (id)
);
