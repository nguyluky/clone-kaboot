import SessionModel from '../model/SessionModel.js';
import CauHoiModel from '../model/CauHoiModel.js'
import PlayerModel from '../model/PlayerModel.js';

import HTTP_STATUS from '../constants/httpStatus.js';
import { DocumentNotFoundError, BadRequestError } from '../utils/error.js';

/** @type {import('../utils/help.js').SessionControllerInterface} */
const SessionController = {
    async getAllSessions(req, res, next) {
        try {
            const sessions = await SessionModel.getAll();
            res.status(HTTP_STATUS.OK).json(sessions);
        } catch (err) {
            next(err);
        }
    },

    async getSessionById(req, res, next) {
        try {
            const { session_id } = req.params;
            const session = await SessionModel.findById(session_id);
            if (!session) {
                throw new DocumentNotFoundError('Session not found')
            }
            res.status(HTTP_STATUS.OK).json(session);
        } catch (err) {
            next(err);
        }
    },

    // async getSessionsByCanvaId(req, res, next) {
    //     try {
    //         const { canva_id } = req.params;
    //         const sessions = await SessionModel.getByCanvaId(canva_id);
    //         if (sessions.length === 0) {
    //             throw new DocumentNotFoundError('No sessions found for this canva');
    //         }
    //         res.status(HTTP_STATUS.OK).json(sessions);
    //     } catch (err) {
    //         next(err);
    //     }
    // },

    async createSession(req, res, next) {
        try {
            const { title, code_join, canva_id, is_public } = req.body;
            const session = await SessionModel.create({
                title,
                code_join,
                canva_id,
                is_public:  is_public ?? false,
                thoi_gian_tao: new Date()
            });
            res.status(HTTP_STATUS.CREATED).json(session);
        } catch (err) {
            next(err);
        }
    },

    async updateSession(req, res, next) {
        try {
            const { session_id } = req.params;
            const { title, code_join, canva_id, is_public  } = req.body;
            const result = await SessionModel.update(session_id, {
                title, code_join, canva_id, is_public
            });
            if (result.affectedRows === 0) {
                throw new DocumentNotFoundError('Session not found');
            }
            res.status(HTTP_STATUS.NO_CONTENT).json(result);
        } catch (err) {
            next(err);
        }
    },

    async deleteSession(req, res, next) {
        try {
            const { session_id } = req.params;
            const result = await SessionModel.delete(session_id);
            if (result.affectedRows === 0) {
                throw new DocumentNotFoundError('Session not found');
            }
            res.status(HTTP_STATUS.NO_CONTENT).json(result);
        } catch (err) {
            next(err);
        }
    },

    async getLeaderBoard(req, res, next) {
        try {
            const { session_id } = req.params;
            const session = await SessionModel.findById(session_id);
            if (!session) {
                throw new DocumentNotFoundError('Session not found');
            }
            
            const leaderBoard = await PlayerModel.getBySessionId(session_id);
            if (leaderBoard.length === 0) {
                throw new DocumentNotFoundError('No players found for this session');
            }
            res.status(HTTP_STATUS.OK).json(leaderBoard);
        } catch (err) {
            next(err);
        }
    },

    async getSessionByCodeJoin(req, res, next) {
        try {
            const { code_join } = req.params;
            const session = await SessionModel.getByCodeJoin(code_join);
            if (!session) {
                throw new DocumentNotFoundError('Session not found');
            }
            res.status(HTTP_STATUS.OK).json(session);
        } catch (err) {
            next(err);
        }
    },

    async getQuestion(req, res, next) {
        try {
            const { code_join } = req.params;

            const session = await SessionModel.getByCodeJoin(code_join);
            if (!session) {
                throw new DocumentNotFoundError('Session not found');
            }
            const canva_id = session.canva_id;
            let questions = await CauHoiModel.getWithLuaChonByCanvaId(canva_id);
            questions = questions.map(e => {
                e.lua_chon = e.lua_chon.map(j => {
                    j.dung = false;
                    return j;
                })
                return e;
            })
            res.status(HTTP_STATUS.OK).json(questions);

        } catch (err) {
            next(err);
        }
    },

    async getAllPublicSessions(req, res, next) {
        try {
            const sessions = await SessionModel.getPublicSessions();
            if (sessions.length === 0) {
                throw new DocumentNotFoundError('No public sessions found');
            }
            res.status(HTTP_STATUS.OK).json(sessions);
        }
        catch (err) {
            next(err);
        }
    },

    async submitAnswers(req, res, next) {
        try {
            const {code_join} = req.params;
            const {
                player,
                answers
            } = req.body;

            const session = await SessionModel.getByCodeJoin(code_join);
            if (!session) {
                throw new DocumentNotFoundError('Session not found');
            }

            const lua_chons = (await CauHoiModel.getByCanvaId(session.canva_id)).map(e => e.lua_chon).flat();
            let cau_dung = answers.filter(e => {
                const lc = lua_chons.find(j => j.lua_chon_id === e.lua_chon_id);
                return lc?.dung;
            })

            // console.log(answers, cau_dung)

            const thoi_gian_vao = new Date(player.thoi_gian_vao);
            if (isNaN(thoi_gian_vao.getTime())) {
                throw new BadRequestError('Invalid time format');
            }

            const result = await PlayerModel.create({
                name: player.name,
                email: player.email,
                sdt: player.sdt,
                thoi_gian_vao: new Date(player.thoi_gian_vao),
                thoi_gian_ket_thuc: new Date(),
                session_id: session.session_id + '',
                point: cau_dung.length,
                bai_lam: answers,
            })

            res.status(HTTP_STATUS.OK).json(result);
        }
        catch (err) {
            next(err);
        }
    }

}

export default SessionController;
