-- Use the database
USE `clone_kaboot`;

-- Clear existing data
TRUNCATE TABLE `player`;
TRUNCATE TABLE `session`;
TRUNCATE TABLE `lua_chon`;
TRUNCATE TABLE `cau_hoi`;
TRUNCATE TABLE `canva`;

-- Insert random data into canva table
INSERT INTO `canva` (`tieu_de`, `ngay_tao`, `is_public`) VALUES
('Quiz về Toán học', '2023-01-15 10:30:00', TRUE),
('Kiểm tra Lịch sử', '2023-02-20 14:15:00', FALSE),
('Trò chơi Địa lý', '2023-03-05 09:45:00', TRUE),
('Ôn tập Văn học', '2023-03-10 16:20:00', FALSE),
('Câu đố Khoa học', '2023-04-02 11:00:00', FALSE);

-- Insert random data into cau_hoi table
INSERT INTO `cau_hoi` (`canva_id`, `noi_dung`, `dinh_dang`, `thoi_gian`) VALUES
-- Quiz về Toán học
(1, 'Kết quả của 5 + 7 là bao nhiêu?', 'htmldecode', 30),
(1, 'Căn bậc hai của 144 là?', 'htmldecode', 45),
(1, 'Giải phương trình x² - 9 = 0', 'markdown', 60),
-- Kiểm tra Lịch sử
(2, 'Ai là người phát hiện ra châu Mỹ?', 'htmldecode', 45),
(2, 'Năm bao nhiêu Việt Nam giành độc lập?', 'htmldecode', 30),
(2, 'Trận Điện Biên Phủ diễn ra vào năm nào?', 'markdown', 30),
-- Trò chơi Địa lý
(3, 'Thủ đô của Pháp là gì?', 'htmldecode', 20),
(3, 'Sông nào dài nhất thế giới?', 'markdown', 30),
(3, 'Núi Everest nằm ở quốc gia nào?', 'htmldecode', 25),
-- Ôn tập Văn học
(4, 'Ai là tác giả của Truyện Kiều?', 'htmldecode', 30),
(4, 'Tác phẩm "Số Đỏ" của tác giả nào?', 'htmldecode', 40),
-- Câu đố Khoa học
(5, 'Công thức hóa học của nước là gì?', 'markdown', 25),
(5, 'Hành tinh nào gần Mặt Trời nhất?', 'htmldecode', 30);

-- Insert random data into lua_chon table
INSERT INTO `lua_chon` (`cau_hoi_id`, `noi_dung`, `dung`) VALUES
-- Câu hỏi 1: Kết quả của 5 + 7
(1, '10', FALSE),
(1, '12', TRUE),
(1, '14', FALSE),
(1, '8', FALSE),
-- Câu hỏi 2: Căn bậc hai của 144
(2, '10', FALSE),
(2, '12', TRUE),
(2, '14', FALSE),
(2, '16', FALSE),
-- Câu hỏi 3: Giải phương trình x² - 9 = 0
(3, 'x = 3 và x = -3', TRUE),
(3, 'x = 9 và x = -9', FALSE),
(3, 'x = 3', FALSE),
(3, 'x = 0', FALSE),
-- Câu hỏi 4: Ai là người phát hiện ra châu Mỹ
(4, 'Christopher Columbus', TRUE),
(4, 'James Cook', FALSE),
(4, 'Marco Polo', FALSE),
-- Câu hỏi 5: Năm bao nhiêu Việt Nam giành độc lập
(5, '1945', TRUE),
(5, '1954', FALSE),
(5, '1975', FALSE),
(5, '1930', FALSE),
-- Câu hỏi 6: Trận Điện Biên Phủ
(6, '1954', TRUE),
(6, '1945', FALSE),
(6, '1975', FALSE),
-- Câu hỏi 7: Thủ đô của Pháp
(7, 'Paris', TRUE),
(7, 'London', FALSE),
(7, 'Berlin', FALSE),
(7, 'Rome', FALSE),
-- Câu hỏi 8: Sông nào dài nhất thế giới
(8, 'Amazon', FALSE),
(8, 'Nile', TRUE),
(8, 'Mississippi', FALSE),
(8, 'Mekong', FALSE),
-- Câu hỏi 9: Núi Everest
(9, 'Nepal', TRUE),
(9, 'Trung Quốc', FALSE),
(9, 'Ấn Độ', FALSE),
(9, 'Nepal và Trung Quốc', FALSE),
-- Câu hỏi 10: Tác giả Truyện Kiều
(10, 'Nguyễn Du', TRUE),
(10, 'Hồ Xuân Hương', FALSE),
(10, 'Nguyễn Trãi', FALSE),
-- Câu hỏi 11: Tác giả Số Đỏ
(11, 'Nam Cao', FALSE),
(11, 'Vũ Trọng Phụng', TRUE),
(11, 'Ngô Tất Tố', FALSE),
(11, 'Nguyễn Công Hoan', FALSE),
-- Câu hỏi 12: Công thức nước
(12, 'H2O', TRUE),
(12, 'CO2', FALSE),
(12, 'H2O2', FALSE),
-- Câu hỏi 13: Hành tinh gần mặt trời nhất
(13, 'Venus', FALSE),
(13, 'Mercury', TRUE),
(13, 'Mars', FALSE),
(13, 'Earth', FALSE);

-- Insert random data into session table
INSERT INTO `session` (`title`, `code_join`, `canva_id`, `thoi_gian_bat_dau`, `trang_thai`) VALUES
('Buổi ôn tập Toán', 'MATH123', 1, '2023-05-10 09:00:00', 'ket_thuc'),
('Kiểm tra 15p Lịch sử', 'HIST456', 2, NULL, 'doi'),
('Ôn thi cuối kỳ', 'GEOG789', 3, '2023-05-15 14:30:00', 'dang_choi'),
('Sinh hoạt ngoại khóa', 'LIT321', 4, '2023-05-12 10:15:00', 'ket_thuc');

-- Insert random data into player table
INSERT INTO `player` (`uuid`, `session_id`, `name`, `email`, `std`, `point`, `thoi_gian_vao`, `thoi_gian_ket_thuc`, `bai_lam`) VALUES
-- Session 1: Buổi ôn tập Toán
('a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6', 1, 'Nguyễn Văn A', 'nguyenvana@gmail.com', '20210001', 850, '2023-05-10 09:05:00', '2023-05-10 09:35:00', '{"answers": [{"question_id": 1, "choice_id": 2}, {"question_id": 2, "choice_id": 6}, {"question_id": 3, "choice_id": 9}]}'),
('b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7', 1, 'Trần Thị B', 'tranthib@gmail.com', '20210002', 950, '2023-05-10 09:03:00', '2023-05-10 09:32:00', '{"answers": [{"question_id": 1, "choice_id": 2}, {"question_id": 2, "choice_id": 6}, {"question_id": 3, "choice_id": 9}]}'),
('c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8', 1, 'Lê Văn C', 'levanc@gmail.com', '20210003', 750, '2023-05-10 09:02:00', '2023-05-10 09:40:00', '{"answers": [{"question_id": 1, "choice_id": 1}, {"question_id": 2, "choice_id": 6}, {"question_id": 3, "choice_id": 9}]}'),
('d4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9', 1, 'Phạm Thị D', 'phamthid@gmail.com', '20210004', 800, '2023-05-10 09:08:00', '2023-05-10 09:36:00', '{"answers": [{"question_id": 1, "choice_id": 2}, {"question_id": 2, "choice_id": 5}, {"question_id": 3, "choice_id": 9}]}'),
-- Session 2: Kiểm tra 15p Lịch sử (chưa bắt đầu)
('e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0', 2, 'Võ Văn E', 'vovane@gmail.com', '20210005', 0, '2023-05-15 08:50:00', NULL, '{"answers": []}'),
('f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1', 2, 'Ngô Thị F', 'ngothif@gmail.com', '20210006', 0, '2023-05-15 08:55:00', NULL, '{"answers": []}'),
('g7h8i9j0-k1l2-m3n4-o5p6-q7r8s9t0u1v2', 2, 'Đặng Văn G', 'dangvang@gmail.com', '20210007', 0, '2023-05-15 08:52:00', NULL, '{"answers": []}'),
-- Session 3: Ôn thi cuối kỳ (đang chơi)
('h8i9j0k1-l2m3-n4o5-p6q7-r8s9t0u1v2w3', 3, 'Bùi Thị H', 'buithih@gmail.com', '20210008', 200, '2023-05-15 14:25:00', NULL, '{"answers": [{"question_id": 7, "choice_id": 25}]}'),
('i9j0k1l2-m3n4-o5p6-q7r8-s9t0u1v2w3x4', 3, 'Trương Văn I', 'truongvani@gmail.com', '20210009', 150, '2023-05-15 14:28:00', NULL, '{"answers": [{"question_id": 7, "choice_id": 25}]}'),
('j0k1l2m3-n4o5-p6q7-r8s9-t0u1v2w3x4y5', 3, 'Mai Thị K', 'maithik@gmail.com', '20210010', 100, '2023-05-15 14:27:00', NULL, '{"answers": []}'),
('k1l2m3n4-o5p6-q7r8-s9t0-u1v2w3x4y5z6', 3, 'Hồ Văn L', 'hovanl@gmail.com', '20210011', 250, '2023-05-15 14:26:00', NULL, '{"answers": [{"question_id": 7, "choice_id": 25}, {"question_id": 8, "choice_id": 30}]}'),
-- Session 4: Sinh hoạt ngoại khóa (kết thúc)
('l2m3n4o5-p6q7-r8s9-t0u1-v2w3x4y5z6a7', 4, 'Dương Thị M', 'duongthim@gmail.com', '20210012', 650, '2023-05-12 10:10:00', '2023-05-12 10:40:00', '{"answers": [{"question_id": 10, "choice_id": 37}, {"question_id": 11, "choice_id": 41}]}'),
('m3n4o5p6-q7r8-s9t0-u1v2-w3x4y5z6a7b8', 4, 'Lý Văn N', 'lyvann@gmail.com', '20210013', 700, '2023-05-12 10:12:00', '2023-05-12 10:38:00', '{"answers": [{"question_id": 10, "choice_id": 37}, {"question_id": 11, "choice_id": 41}]}'),
('n4o5p6q7-r8s9-t0u1-v2w3-x4y5z6a7b8c9', 4, 'Phan Thị O', 'phanthio@gmail.com', '20210014', 600, '2023-05-12 10:14:00', '2023-05-12 10:42:00', '{"answers": [{"question_id": 10, "choice_id": 37}, {"question_id": 11, "choice_id": 40}]}');



-- SELECT * FROM `lua_chon` JOIN `cau_hoi` ON `lua_chon`.`cau_hoi_id` = `cau_hoi`.`id`:
SELECT lua_chon.* FROM `lua_chon` JOIN `cau_hoi` on lua_chon.cau_hoi_id = cau_hoi.cau_hoi_id WHERE cau_hoi.canva_id = 4;

-- output: {
--     "cau_hoi_id": 4,
--     "noi_dung": "Ai là tác giả của Truyện Kiều?",
--     "dinh_dang": "htmldecode",
--     "thoi_gian": 30,
--     "lua_chon": [
--         {
--             "lua_chon_id": 10,
--             "noi_dung": "Nguyễn Du",
--             "dung": true
--         },
--         {
--             "lua_chon_id": 11,
--             "noi_dung": "Hồ Xuân Hương",
--             "dung": false
--         },
--       ]
--     }
SELECT 
    `cau_hoi`.*,  
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'lua_chon_id', `lua_chon`.`lua_chon_id`,
                'noi_dung', `lua_chon`.`noi_dung`,
                'dung', `lua_chon`.`dung`
            )
        )
        FROM `lua_chon` 
        WHERE `lua_chon`.`cau_hoi_id` = `cau_hoi`.`cau_hoi_id`
    ) as lua_chon
FROM `cau_hoi` WHERE `cau_hoi`.`canva_id` = 4;