-- Xóa database nếu đã tồn tại (cẩn thận khi dùng trong production)
DROP DATABASE IF EXISTS `clone_kaboot`;

-- Tạo database mới
CREATE DATABASE `clone_kaboot`;

-- Sử dụng database vừa tạo
USE `clone_kaboot`;

-- Tạo bảng `canva`
CREATE TABLE `Canva` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `title` VARCHAR(100) NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `description` TEXT NOT NULL,
    `lastModified` DATETIME NOT NULL,
    `created` DATETIME NOT NULL
);

-- Tạo bảng `cau_hoi`
CREATE TABLE `Question` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `type` ENUM('multiple_choice', 'single_choice', 'text') NOT NULL,
    `question` TEXT NOT NULL,
    `point` INT NOT NULL,
    `timeLimit` INT NOT NULL,
    `canva_id` INT NOT NULL,
    FOREIGN KEY (`canva_id`) REFERENCES `Canva`(`id`) ON DELETE CASCADE
);

-- Tạo bảng `lua_chon`
CREATE TABLE `Options` (
    `id` int PRIMARY KEY AUTO_INCREMENT,
    `text` TEXT NOT NULL,
    `isCorrect` BOOLEAN NOT NULL,
    `question_id` INT NOT NULL,
    FOREIGN KEY (`question_id`) REFERENCES `Question`(`id`) ON DELETE CASCADE
);

-- Tạo bảng `session`
CREATE TABLE `Session` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `created` DATETIME NOT NULL,
    `code_join` VARCHAR(10) NOT NULL,
    `canva_id` INT NOT NULL,
    `is_public` BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (`canva_id`) REFERENCES `Canva`(`id`) ON DELETE CASCADE
);

-- Tạo bảng `player`
CREATE TABLE `Player` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    `sdt` VARCHAR(12) NOT NULL,
    `email` VARCHAR(300) NOT NULL,
    `checkIn` DATETIME NOT NULL,
    `checkOut` DATETIME DEFAULT NULL,
    `session_id` INT NOT NULL,
    FOREIGN KEY (`session_id`) REFERENCES `Session`(`id`) ON DELETE CASCADE
);

CREATE TABLE `Answers` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `player_id` INT NOT NULL,
    `question_id` INT NOT NULL,
    `option_id` INT,
    `responseTime` INT NOT NULL,
    FOREIGN KEY (`player_id`) REFERENCES `Player`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`question_id`) REFERENCES `Question`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`option_id`) REFERENCES `Options`(`id`) ON DELETE CASCADE
);




