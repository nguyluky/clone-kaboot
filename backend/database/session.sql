
CREATE Table `session` (
    `session_id` INT PRIMARY KEY AUTO_INCREMENT,
    `title` VARCHAR(100),
    `code_join` VARCHAR(10),
    `canva_id` int,
    `thoi_gian_bat_dau` DATETIME DEFAULT NULL,
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