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

-- get all cua hoi
SELECT  FROM `cau_hoi` WHERE canva_id=?;

-- get all lua chon
SELECT * FROM `lua_chon` WHERE cauhoi_id=?;

-- add cau hoi
INSERT INTO `cau_hoi`(`canva_id`, `noi_dung`, `dinh_dang`, `thoi_gian`) 
VALUES(?, ?, ?, ?);

-- edit cau hoi

-- add lua chon
INSERT INTO `lua_chon`(`cau_hoi_id`, `noi_dung`, `dung`)
VALUES (?, ?, ?);