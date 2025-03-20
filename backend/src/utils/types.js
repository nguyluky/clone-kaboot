/** 
 * @typedef {Object} CanvaType
 * @property {number} canva_id
 * @property {string} tieu_de - Tên của bảng câu hỏi, max length 100
 * @property {Date} ngay_tao - Ngày tạo bảng câu hỏi
*/

/**
 * @typedef {import('mysql2').ResultSetHeader} ResultSetHeader
 * 
 * @typedef {Object} LuaChonType
 * @property {number} lua_chon_id - ID của lựa chọn
 * @property {number} cau_hoi_id - ID của câu hỏi
 * @property {string} noi_dung - Nội dung lựa chọn
 * @property {boolean} dung
 * 
 * @typedef {'htmldecode' | 'markdown'} CauHoi_DinhDangType
 * 
 * @typedef {Object} CauHoiType
 * @property {number} cau_hoi_id - ID của câu hỏi
 * @property {number} canva_id - ID của bảng câu hỏi
 * @property {string} noi_dung - Nội dung câu hỏi
 * @property {CauHoi_DinhDangType} dinh_dang - Định dạng câu hỏi
 * @property {number} thoi_gian - Thời gian trả lời câu hỏi, NOTE: khong dung
 * 
 * @typedef {CauHoiType & {lua_chon: LuaChonType[]}} CauHoiWithLuaChonType
 */

/**
 * 
 * @typedef {Object} BaiLamType
 * @property {number} cau_hoi_id - ID của câu hỏi
 * @property {number} lua_chon_id - ID của lựa chọn
 * @property {number} thoi_gian_nop - Thời gian nộp bài .getTime()
 * @property {number} thoi_gian_con_lai - not used
 * 
 * @typedef {Object} PlayerType
 * @property {string} uuid - ID của player
 * @property {string} session_id - ID của session
 * @property {string} name - Tên của player
 * @property {string} email - Email của player
 * @property {string} sdt - Số điện thoại của player
 * @property {number} point - Điểm của player
 * @property {Date} thoi_gian_ket_thuc - Thời gian kết thúc
 * @property {Date} thoi_gian_vao - Thời gian vào
 * @property {BaiLamType[]} bai_lam - Bài làm của player
 */

/**
 * 
 * @typedef {Object} SessionType
 * @property {number}  session_id - ID của session
 * @property {string}  title - Tên của session
 * @property {string}  code_join - Mã tham gia của session
 * @property {number}  canva_id - ID của canva
 * @property {Date}    thoi_gian_tao - Thời gian bắt đầu
 * @property {boolean} is_public - Trạng thái của session
 * 
 */