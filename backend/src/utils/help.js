/**
 * Tệp định nghĩa kiểu dữ liệu và giao diện
 * - Tập trung các định nghĩa kiểu dữ liệu sử dụng trong toàn bộ ứng dụng
 * - Không chứa code triển khai, chỉ có JSDoc và định nghĩa kiểu
 * - Giúp quản lý code, giảm lặp lại và cải thiện khả năng bảo trì
 */

import { CAU_HOI_ROUTES, CANVA_ROUTES, SESSION_ROUTES, PLAYER_ROUTES } from '../constants/routes.js';

//--------------------------------------------------------------------------
// Các kiểu dữ liệu cơ bản
//--------------------------------------------------------------------------

/**
 * @template {Object} Params - Tham số route
 * @template {Object} Query - Tham số truy vấn
 * @template {Object} Body - Dữ liệu body
 * @typedef {import('express').Request<Params, any, Body, Query>} Request 
 */

/**
 * @template {Object} RespType - Kiểu dữ liệu phản hồi
 * @typedef {import('express').Response<RespType>} Response 
 */

/** @typedef {import('express').NextFunction} NextFunction */

/**
 * @template {Object} Params
 * @template {Object} Query
 * @template {Object} Body
 * @template {Object} RespType
 * @typedef {(req: Request<Params, Query, Body>, resp: Response<RespType>, next: NextFunction) => any} ApiHandler
 */

/**
 * @template {string} P - Mẫu đường dẫn route
 * @typedef {import('./help.d.ts').RouteParameters<P>} RouteParameters
 */

/**
 * @template {Object} T
 * @template {keyof T} K
 * @typedef {Omit<T, K> & Partial<Pick<T, K>>} PartialBy
 */

/** @typedef {import('mysql2').ResultSetHeader} ResultSetHeader */

//--------------------------------------------------------------------------
// Controller interfaces
//--------------------------------------------------------------------------

/**
 * @typedef {Object} CauHoiControllerInterface
 * 
 * @property {ApiHandler<
 *   RouteParameters<CAU_HOI_ROUTES['BASE']>, 
 *   any, 
 *   any,
 *   CauHoiWithLuaChonType[]
 * >} getAllCauHoi - Lấy tất cả câu hỏi
 * 
 * @property {ApiHandler<
 *   RouteParameters<CAU_HOI_ROUTES['BY_ID']>,
 *   any,
 *   any, 
 *   CauHoiWithLuaChonType
 * >} getCauHoiById - Lấy câu hỏi theo ID
 * 
 * @property {ApiHandler<
 *   RouteParameters<CAU_HOI_ROUTES['BASE']>,
 *   any,
 *   CauHoiType,
 *   ResultSetHeader
 * >} createCauHoi - Tạo câu hỏi mới
 * 
 * @property {ApiHandler<
 *   RouteParameters<CAU_HOI_ROUTES['BY_ID']>,
 *   any,
 *   Partial<CauHoiType>,
 *   ResultSetHeader
 * >} updateCauHoi - Cập nhật câu hỏi
 * 
 * @property {ApiHandler<
 *   RouteParameters<CAU_HOI_ROUTES['BY_ID']>,
 *   any,
 *   any,
 *   ResultSetHeader
 * >} deleteCauHoi - Xóa câu hỏi
 */

/**
 * @typedef {Object} CanvaControllerInterface
 * 
 * @property {ApiHandler<
 *   RouteParameters<CANVA_ROUTES['BASE']>,
 *   any,
 *   any,
 *   CanvaType[]
 * >} getAll - Lấy tất cả canvas
 * 
 * @property {ApiHandler<
 *   RouteParameters<CANVA_ROUTES['BY_ID']>,
 *   any,
 *   any,
 *   CanvaType
 * >} getById - Lấy canvas theo ID
 * 
 * @property {ApiHandler<
 *   RouteParameters<CANVA_ROUTES['BASE']>,
 *   any,
 *   CanvaType,
 *   ResultSetHeader
 * >} createCanva - Tạo canvas mới
 * 
 * @property {ApiHandler<
 *   RouteParameters<CANVA_ROUTES['BY_ID']>,
 *   any,
 *   Partial<CanvaType>,
 *   ResultSetHeader
 * >} updateCanva - Cập nhật canvas
 * 
 * @property {ApiHandler<
 *   RouteParameters<CANVA_ROUTES['BY_ID']>,
 *   any,
 *   any,
 *   ResultSetHeader
 * >} deleteCanva - Xóa canvas
 * 
 * @property {ApiHandler<
 *   RouteParameters<CANVA_ROUTES['SESSION']>,
 *   any,
 *   any,
 *   SessionType[]
 * >} getAllSessionByCanvaId - Lấy các phiên theo canvas ID
 * 
 * @property {ApiHandler<
 *   RouteParameters<CANVA_ROUTES['CAU_HOI']>,
 *   any,
 *   any,
 *   CauHoiType[]
 * >} getAllCauHoiByCanvaId - Lấy các câu hỏi theo canvas ID
 */

/**
 * @typedef {Object} SessionControllerInterface
 * 
 * @property {ApiHandler<
 *   RouteParameters<SESSION_ROUTES['BASE']>,
 *   any,
 *   any,
 *   SessionType[]
 * >} getAllSessions - Lấy tất cả phiên
 * 
 * @property {ApiHandler<
 *   RouteParameters<SESSION_ROUTES['BY_ID']>,
 *   any,
 *   any,
 *   SessionType
 * >} getSessionById - Lấy phiên theo ID
 * 
 * @property {ApiHandler<
 *   RouteParameters<SESSION_ROUTES['BASE']>,
 *   any,
 *   SessionType,
 *   ResultSetHeader
 * >} createSession - Tạo phiên mới
 * 
 * @property {ApiHandler<
 *   RouteParameters<SESSION_ROUTES['BY_ID']>,
 *   any,
 *   Partial<SessionType>,
 *   ResultSetHeader
 * >} updateSession - Cập nhật phiên
 * 
 * @property {ApiHandler<
 *   RouteParameters<SESSION_ROUTES['BY_ID']>,
 *   any,
 *   any,
 *   ResultSetHeader
 * >} deleteSession - Xóa phiên
 * 
 * @property {ApiHandler<
 *   RouteParameters<SESSION_ROUTES['LEADERBOARD']>,
 *   any,
 *   any,
 *   PlayerType[]
 * >} getLeaderBoard - Lấy bảng xếp hạng
 * 
 * @property {ApiHandler<
 *   RouteParameters<SESSION_ROUTES['BY_CODE_JOIN']>,
 *   any,
 *   any,
 *   SessionType
 * >} getSessionByCodeJoin - Lấy phiên theo mã tham gia
 * 
 * @property {ApiHandler<
 *   RouteParameters<SESSION_ROUTES['QUESTION']>,
 *   any,
 *   any,
 *   CauHoiWithLuaChonType[]
 * >} getQuestion - Lấy câu hỏi cho phiên
 * 
 * @property {ApiHandler<
 *   RouteParameters<SESSION_ROUTES['SUBMIT_ANSWER']>,
 *   any,
 *   any,
 *   ResultSetHeader
 * >} submitAnswers - Gửi câu trả lời
 * 
 * @property {ApiHandler<
 *   RouteParameters<SESSION_ROUTES['PUBLIC']>,
 *   any,
 *   any,
 *   SessionType[]
 * >} getAllPublicSessions - Lấy các phiên công khai
 */

/**
 * @typedef {Object} PlayerControllerInterface
 * 
 * @property {ApiHandler<
 *   RouteParameters<PLAYER_ROUTES['BASE']>,
 *   any,
 *   any,
 *   PlayerType[]
 * >} getAllPlayers - Lấy tất cả người chơi
 * 
 * @property {ApiHandler<
 *   RouteParameters<PLAYER_ROUTES['BY_ID']>,
 *   any,
 *   any,
 *   PlayerType
 * >} getPlayerById - Lấy người chơi theo ID
 * 
 * @property {ApiHandler<
 *   RouteParameters<PLAYER_ROUTES['BASE']>,
 *   any,
 *   PlayerType,
 *   ResultSetHeader
 * >} createPlayer - Tạo người chơi mới
 * 
 * @property {ApiHandler<
 *   RouteParameters<PLAYER_ROUTES['BY_ID']>,
 *   any,
 *   Partial<PlayerType>,
 *   ResultSetHeader
 * >} updatePlayer - Cập nhật người chơi
 * 
 * @property {ApiHandler<
 *   RouteParameters<PLAYER_ROUTES['BY_ID']>,
 *   any,
 *   any,
 *   ResultSetHeader
 * >} deletePlayer - Xóa người chơi
 */