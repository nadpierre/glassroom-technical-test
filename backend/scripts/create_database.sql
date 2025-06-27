CREATE DATABASE IF NOT EXISTS glassroom;
USE glassroom;
CREATE USER 'base_user'@'localhost';
GRANT ALL PRIVILEGES ON glassroom.* TO 'base_user'@'localhost' IDENTIFIED BY 'wMT1eAxe';