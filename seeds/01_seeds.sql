/*DELETE FROM users;
DELETE FROM properties;
DELETE FROM reservations;
DELETE FROM property_reviews;
*/

INSERT INTO users (name, email, password)
VALUES ('Natalia', 'natalia@mail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Galina', 'galina@mail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Audrey', 'audrey@mail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'Euro-Zen Private Estate', 'description', 'https://www.vrbo.com/en-ca/cottage-rental/p1013512vb?noDates=true', 'https://www.vrbo.com/en-ca/cottage-rental/p1013512vb?noDates=true', 1800, 4, 5, 5, 'Canada', 'Cowan Rd', 'West Vancouver', 'British Columbia', 'V6G 2G4', TRUE),
(2, 'Beachfront Urbanova', 'description', 'https://www.vrbo.com/6653340ha?noDates=true', 'https://www.vrbo.com/6653340ha?noDates=true', 200, 2, 2, 1, 'Spain', 'Salada', 'Alicante', 'Valencia', '123456', TRUE),
(3, 'Shibuya-ku Apartment', 'description', 'https://realestate.co.jp/rent/view/301699', 'https://realestate.co.jp/rent/view/301699', 300, 1, 1, 1, 'Japan', 'Daikanyama ', 'Tokyo', 'Uguisudanicho', 'G1S4S1', TRUE);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2018-10-11', '2020-10-11', 1, 2),
('2019-01-01', '2022-01-01', 2, 3),
('2019-01-01', '2030-01-01', 3, 1);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (2, 1, 1, 3, 'message'),
(3, 2, 2, 5, 'message'),
(1, 3, 3, 5, 'message');