-- database.main.Collections definition

CREATE TABLE Collections(id INTEGER PRIMARY KEY,
"name" VARCHAR,
description VARCHAR);

-- database.main.Comments definition

CREATE TABLE "Comments"(id INTEGER PRIMARY KEY,
picture_id INTEGER,
commenter INTEGER,
comment_text VARCHAR,
FOREIGN KEY (commenter) REFERENCES Users(id),
FOREIGN KEY (picture_id) REFERENCES Pictures(id));

-- database.main.Pictures definition

CREATE TABLE Pictures(id INTEGER PRIMARY KEY,
sample_id INTEGER,
image_url VARCHAR,
FOREIGN KEY (sample_id) REFERENCES Samples(id));

-- database.main.Samples definition

CREATE TABLE Samples(id INTEGER PRIMARY KEY,
subcollection_id INTEGER,
status ENUM('new',
'in_review',
'external_task',
'production',
'testing',
'accepted',
'rejected',
'readjustment',
'cut_phase',
'preparing_traces',
'ready'),
timeline JSON,
FOREIGN KEY (subcollection_id) REFERENCES SubCollections(id));

-- database.main.SubCollections definition

CREATE TABLE SubCollections(id INTEGER PRIMARY KEY,
collection_id INTEGER,
"name" VARCHAR,
FOREIGN KEY (collection_id) REFERENCES Collections(id));

-- database.main.Users definition

CREATE TABLE Users(id INTEGER DEFAULT(nextval('users_id_seq')) PRIMARY KEY,
"name" VARCHAR,
email VARCHAR UNIQUE,
phone VARCHAR UNIQUE,
"password" VARCHAR,
"role" ENUM('Stylist',
'Manager',
'Modelist',
'ExecutiveWorker',
'Tester'));


-- database.main.Users definition
CREATE SEQUENCE users_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 4 NO CYCLE;