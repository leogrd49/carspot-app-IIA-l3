DROP DATABASE IF EXISTS carspot_db;
CREATE DATABASE carspot_db;
USE carspot_db;

SET SQL_SAFE_UPDATES = 0;

CREATE TABLE users (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(100),
    created_at DATETIME,
    updated_at DATETIME
);

CREATE TABLE brands (
    id_brand INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50)
);

CREATE TABLE models (
    id_model INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50)
);

CREATE TABLE trims (
    id_trim INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50)
);

CREATE TABLE specs (
    id_specs INT AUTO_INCREMENT PRIMARY KEY,
    price DECIMAL(15,2),
    engine VARCHAR(50),
    weight DECIMAL(15,2),
    horse_power VARCHAR(50)
);

CREATE TABLE cars (
    id_car INT AUTO_INCREMENT PRIMARY KEY,
    id_specs INT NOT NULL,
    id_trim INT NOT NULL,
    id_model INT NOT NULL,
    id_brand INT NOT NULL,
    FOREIGN KEY (id_specs) REFERENCES specs(id_specs),
    FOREIGN KEY (id_trim) REFERENCES trims(id_trim),
    FOREIGN KEY (id_model) REFERENCES models(id_model),
    FOREIGN KEY (id_brand) REFERENCES brands(id_brand)
);

CREATE TABLE Spot (
    id_user INT,
    id_car INT,
    spoted_at DATETIME,
    location VARCHAR(50),
    PRIMARY KEY (id_user, id_car),
    FOREIGN KEY (id_user) REFERENCES users(id_user),
    FOREIGN KEY (id_car) REFERENCES cars(id_car)
);

INSERT INTO users (username, email, created_at, updated_at) VALUES
('Alice', 'alice@mail.com', NOW(), NOW()),
('Bob', 'bob@mail.com', NOW(), NOW()),
('Charlie', 'charlie@mail.com', NOW(), NOW()),
('David', 'david@mail.com', NOW(), NOW()),
('Eve', 'eve@mail.com', NOW(), NOW()),
('Frank', 'frank@mail.com', NOW(), NOW()),
('Grace', 'grace@mail.com', NOW(), NOW()),
('Henry', 'henry@mail.com', NOW(), NOW()),
('Ivy', 'ivy@mail.com', NOW(), NOW()),
('Jack', 'jack@mail.com', NOW(), NOW());

INSERT INTO brands (name) VALUES
('Ferrari'),
('Lamborghini'),
('Porsche'),
('BMW'),
('Mercedes'),
('Audi'),
('Bugatti'),
('McLaren'),
('Toyota'),
('Nissan');

INSERT INTO models (name) VALUES
('488'),
('Aventador'),
('911 Turbo'),
('M3'),
('AMG GT'),
('RS6'),
('Chiron'),
('720S'),
('Supra'),
('GT-R');

INSERT INTO trims (name) VALUES
('Base'),
('Sport'),
('Track'),
('Luxury'),
('Performance'),
('Black Edition'),
('Nismo'),
('Pro'),
('Competition'),
('Ultimate');

INSERT INTO specs (price, engine, weight, horse_power) VALUES
(250000,'V8',1500,'670'),
(400000,'V12',1700,'740'),
(180000,'Flat-6',1600,'580'),
(90000,'V6',1550,'450'),
(140000,'V8',1650,'520'),
(120000,'V8',1700,'600'),
(3000000,'W16',2000,'1500'),
(280000,'V8',1450,'710'),
(60000,'V6',1600,'340'),
(100000,'V6',1650,'570');

INSERT INTO cars (id_specs, id_trim, id_model, id_brand) VALUES
(1,1,1,1),
(2,2,2,2),
(3,3,3,3),
(4,4,4,4),
(5,5,5,5),
(6,6,6,6),
(7,7,7,7),
(8,8,8,8),
(9,9,9,9),
(10,10,10,10);

INSERT INTO Spot (id_user, id_car, spoted_at, location) VALUES
(1,1,NOW(),'Paris'),
(2,2,NOW(),'Lyon'),
(3,3,NOW(),'Marseille'),
(4,4,NOW(),'Nice'),
(5,5,NOW(),'Toulouse'),
(6,6,NOW(),'Bordeaux'),
(7,7,NOW(),'Nantes'),
(8,8,NOW(),'Lille'),
(9,9,NOW(),'Rennes'),
(10,10,NOW(),'Strasbourg');

SELECT location, COUNT(*) AS nb_spots
FROM Spot 
GROUP BY location;

SELECT username 
FROM users 
ORDER BY created_at DESC;

SELECT users.username, brands.name 
FROM Spot
JOIN users ON users.id_user = Spot.id_user
JOIN cars ON cars.id_car = Spot.id_car
JOIN brands ON brands.id_brand = cars.id_brand;

UPDATE users 
SET email = 'modif@mail.com' 
WHERE id_user = 1;

DELETE FROM Spot 
WHERE location = 'Paris';

SELECT location, COUNT(*) 
FROM Spot 
GROUP BY location 
HAVING COUNT(*) > 1;

SELECT name 
FROM brands 
UNION 
SELECT name 
FROM models;

ALTER TABLE users 
ADD phone VARCHAR(20);

ALTER TABLE cars 
DROP FOREIGN KEY cars_ibfk_2;

DROP TABLE IF EXISTS trims;

SELECT *
FROM users 
LIMIT 5;

SELECT DISTINCT location 
FROM Spot;

SELECT * 
FROM users 
WHERE username LIKE 'A%';

SELECT * 
FROM cars 
WHERE id_brand IN (1,2,3);

SELECT * 
FROM specs 
WHERE price BETWEEN 50000 AND 300000;

SELECT id_user,
CASE
    WHEN id_user <= 3 THEN 'Niveau 1'
    WHEN id_user <= 6 THEN 'Niveau 2'
    ELSE 'Niveau 3'
END AS niveau
FROM users;

TRUNCATE TABLE Spot;

EXPLAIN SELECT * 
FROM users;

CREATE VIEW vue_spots AS
SELECT users.username, cars.id_car 
FROM Spot
JOIN users ON users.id_user = Spot.id_user
JOIN cars ON cars.id_car = Spot.id_car;

CREATE OR REPLACE VIEW vue_spots_v2 AS
SELECT users.username, location 
FROM Spot
JOIN users ON users.id_user = Spot.id_user;

DROP VIEW vue_spots_v2;

