-- Xóa database nếu đã tồn tại (cẩn thận khi dùng trong production)
DROP DATABASE IF EXISTS `clone_kaboot`;

-- Tạo database mới
CREATE DATABASE `clone_kaboot`;

-- Sử dụng database vừa tạo
USE `clone_kaboot`;

-- Tạo bảng `account`
CREATE TABLE `account` (
    `user_name` VARCHAR(100) PRIMARY KEY,
    `password` VARCHAR(255) NOT NULL,
    `email` VARCHAR(300) NOT NULL
);

-- Tạo bảng `canva`
CREATE TABLE `canva` (
    `canva_id` INT PRIMARY KEY AUTO_INCREMENT,
    `tieu_de` VARCHAR(100) NOT NULL,
    `ngay_tao` DATETIME NOT NULL
);

-- Tạo bảng `cau_hoi`
CREATE TABLE `cau_hoi` (
    `cau_hoi_id` INT PRIMARY KEY AUTO_INCREMENT,
    `canva_id` INT NOT NULL,
    `noi_dung` TEXT NOT NULL,
    `dinh_dang` ENUM('htmldecode', 'markdown') NOT NULL,
    `thoi_gian` INT NOT NULL,
    FOREIGN KEY (`canva_id`) REFERENCES `canva` (`canva_id`) ON DELETE CASCADE
);

-- Tạo bảng `lua_chon`
CREATE TABLE `lua_chon` (
    `lua_chon_id` INT PRIMARY KEY AUTO_INCREMENT,
    `cau_hoi_id` INT NOT NULL,
    `noi_dung` TEXT NOT NULL,
    `dung` BOOLEAN NOT NULL,
    FOREIGN KEY (`cau_hoi_id`) REFERENCES `cau_hoi` (`cau_hoi_id`) ON DELETE CASCADE
);

-- Tạo bảng `session`
CREATE TABLE `session` (
    `session_id` INT PRIMARY KEY AUTO_INCREMENT,
    `title` VARCHAR(100) NOT NULL,
    `code_join` VARCHAR(10) NOT NULL,
    `canva_id` INT NOT NULL,
    `thoi_gian_bat_dau` DATETIME DEFAULT NULL,
    `trang_thai` ENUM('doi', 'dang_choi', 'ket_thu') NOT NULL,
    FOREIGN KEY (`canva_id`) REFERENCES `canva` (`canva_id`) ON DELETE CASCADE
);

-- Tạo bảng `player`
CREATE TABLE `player` (
    `uuid` VARCHAR(36) PRIMARY KEY,
    `session_id` INT NOT NULL,
    `name` VARCHAR(30) NOT NULL,
    `email` VARCHAR(300) NOT NULL,
    `std` VARCHAR(12) NOT NULL,
    `point` INT NOT NULL DEFAULT 0,
    `thoi_gian_lam_bai` INT DEFAULT NULL,
    `thoi_gian_voa` DATETIME NOT NULL,
    `thoi_gian_ke_thuc` DATETIME DEFAULT NULL,
    `bai_lam` JSON NOT NULL,
    FOREIGN KEY (`session_id`) REFERENCES `session` (`session_id`) ON DELETE CASCADE
);