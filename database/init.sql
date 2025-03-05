-- Active: 1741181324002@@127.0.0.1@3306@clone_kaboot

CREATE DATABASE `clone_kaboot`;

CREATE Table `account` (
    `user_name` VARCHAR(100), PRIMARY KEY,
    `password` VARCHAR(255),
    `email` VARCHAR(300)
);

CREATE Table `canva` (
    `canva_id` int PRIMARY KEY AUTO_INCREMENT,
    `tieu_de` VARCHAR(100),
    `ngay_tao` DATETIME
);

CREATE TABLE `cau_hoi` (
    `cau_hoi_id` int PRIMARY KEY AUTO_INCREMENT,
    `canva_id` int,
    `noi_dung` TEXT,
    `dinh_dang` ENUM("htmldecode", "markdown"),
    `thoi_gian` int,
    Foreign Key (`canva_id`) REFERENCES `canva`(`canva_id`) ON DELETE CASCADE
);

CREATE Table `lua_chon` (
    `lua_chon_id` int PRIMARY KEY AUTO_INCREMENT,
    `cau_hoi_id` int,
    `noi_dung` TEXT,
    `dung` BOOLEAN,
    Foreign Key (`cau_hoi_id`) REFERENCES `cau_hoi`(`cau_hoi_id`) ON DELETE CASCADE
);


CREATE Table `session` (
    `session_id` INT PRIMARY KEY AUTO_INCREMENT,
    `title` VARCHAR(100),
    `code_join` VARCHAR(10),
    `canva_id` int,
    `thoi_gian_bat_dau` DATETIME DEFAULT NULL,
    `trang_thai` ENUM("doi", "dang_choi", "ket_thu"),
    Foreign Key (`canva_id`) REFERENCES `canva`(`canva_id`)
);

CREATE TABLE `player` (
    `uuid` VARCHAR(36) PRIMARY KEY,
    `session_id` int,
    `name` VARCHAR(30),
    `email` VARCHAR(300),
    `std` VARCHAR(12),
    `point` int,
    `thoi_gian_lam_bai` int,
    `thoi_gian_voa` int,
    `bai_lam` JSON,
    Foreign Key (`session_id`) REFERENCES `session`(`session_id`) ON DELETE CASCADE
);
