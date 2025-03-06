-- Thêm tài khoản người dùng
INSERT INTO `account` (`user_name`, `password`, `email`) VALUES
('admin', 'hashed_password_1', 'admin@example.com'),
('user1', 'hashed_password_2', 'user1@example.com');

-- Thêm dữ liệu vào bảng `canva`
INSERT INTO `canva` (`tieu_de`, `ngay_tao`) VALUES
('Bài kiểm tra số 1', NOW()),
('Bài kiểm tra số 2', NOW());

-- Thêm dữ liệu vào bảng `cau_hoi`
INSERT INTO `cau_hoi` (`canva_id`, `noi_dung`, `dinh_dang`, `thoi_gian`) VALUES
(1, 'HTML là gì?', 'markdown', 30),
(1, 'CSS dùng để làm gì?', 'markdown', 30),
(2, 'JavaScript là ngôn ngữ gì?', 'markdown', 30);

-- Thêm dữ liệu vào bảng `lua_chon`
INSERT INTO `lua_chon` (`cau_hoi_id`, `noi_dung`, `dung`) VALUES
(1, 'Ngôn ngữ đánh dấu siêu văn bản', TRUE),
(1, 'Ngôn ngữ lập trình', FALSE),
(2, 'Dùng để tạo kiểu cho trang web', TRUE),
(2, 'Dùng để viết backend', FALSE),
(3, 'Ngôn ngữ lập trình', TRUE),
(3, 'Ngôn ngữ đánh dấu', FALSE);

-- Thêm dữ liệu vào bảng `session`
INSERT INTO `session` (`title`, `code_join`, `canva_id`, `thoi_gian_bat_dau`, `trang_thai`) VALUES
('Phiên 1', 'ABC123', 1, NOW(), 'doi'),
('Phiên 2', 'XYZ789', 2, NOW(), 'dang_choi');

-- Thêm dữ liệu vào bảng `player`
INSERT INTO `player` (`uuid`, `session_id`, `name`, `email`, `std`, `point`, `thoi_gian_lam_bai`, `thoi_gian_voa`, `bai_lam`) VALUES
(UUID(), 1, 'Nguyen Van A', 'nguyenvana@example.com', '123456789', 50, 120, Now(), '{"answers": [1, 3]}'),
(UUID(), 2, 'Tran Thi B', 'tranthib@example.com', '987654321', 70, 100, NOW(), '{"answers": [2, 3]}');


SELECT
    *,
    (
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'lua_chon_id', LC.lua_chon_id,
            'noi_dung', LC.noi_dung,
            'dung', LC.dung
        ))
        FROM lua_chon LC
        WHERE cau_hoi_id = cau_hoi.cau_hoi_id
    ) as lua_chon
FROM cau_hoi WHERE canva_id = 1;


UPDATE `lua_chon` SET noi_dung = "", dung = FALSE WHERE lua_chon_id = 1;

