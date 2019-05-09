### Schema

DROP DATABASE IF EXISTS catburger_db;
CREATE DATABASE catburger_db;
USE catburger_db;

CREATE TABLE burgers
(
	id int NOT NULL AUTO_INCREMENT,
	name varchar(255) NOT NULL,
	devoured BOOLEAN DEFAULT false,
	PRIMARY KEY (id)
);
