// import {
//     findAll,
//     findById,
//     findByCanvaId,
//     createSession,
//     updateSession,
//     deleteSession,
//     getSessionByCodeJoin,
//     getPlayerBySessionId,
//     getLeaderBoard,

// } from '../model/SessionModel.js';
import * as SessionModel from '../model/SessionModel.js';

import { findByCanvaId as findQuestionsByCanvaId, findLuaChonById } from '../model/CauHoiModel.js'
import { findById as filePlayerById, updatePlayer } from '../model/PlayerModel.js';
import HTTP_STATUS from '../constants/httpStatus.js';

class SessionController {
    async getAllSessions(req, res, next) {
        try {
            const sessions = await SessionModel.findAll();
            res.status(HTTP_STATUS.OK).json(sessions);
        } catch (err) {
            next(err);
        }
    }

    async getSessionById(req, res, next) {
        try {
            const { session_id } = req.params;
            const session = await SessionModel.findById(session_id);
            if (!session) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Session not found' });
            }
            res.status(HTTP_STATUS.OK).json(session);
        } catch (err) {
            next(err);
        }
    }

    async getSessionsByCanvaId(req, res, next) {
        try {
            const { canva_id } = req.params;
            const sessions = await SessionModel.findByCanvaId(canva_id);
            if (sessions.length === 0) {
                return res
                    .status(HTTP_STATUS.NOT_FOUND)
                    .json({ message: 'No sessions found for this canva' });
            }
            res.status(HTTP_STATUS.OK).json(sessions);
        } catch (err) {
            next(err);
        }
    }

    async createSession(req, res, next) {
        try {
            const { title, code_join, canva_id, is_public } = req.body;
            const session = await SessionModel.createSession({
                title,
                code_join,
                canva_id,
                is_public:  is_public ?? false,
            });
            res.status(HTTP_STATUS.CREATED).json(session);
        } catch (err) {
            next(err);
        }
    }

    async updateSession(req, res, next) {
        try {
            const { session_id } = req.params;
            const { title, code_join, canva_id, is_public  } = req.body;
            const result = await SessionModel.updateSession(session_id, {
                title, session_id, code_join, canva_id, is_public
            });
            if (result.affectedRows === 0) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Session not found' });
            }
            res.status(HTTP_STATUS.NO_CONTENT).json({ message: 'Session updated successfully' });
        } catch (err) {
            next(err);
        }
    }

    async deleteSession(req, res, next) {
        try {
            const { session_id } = req.params;
            const result = await SessionModel.deleteSession(session_id);
            if (result.affectedRows === 0) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Session not found' });
            }
            res.status(HTTP_STATUS.NO_CONTENT).json({ message: 'Session deleted successfully' });
        } catch (err) {
            next(err);
        }
    }

    async getPlayerBySessionId(req, res, next) {
        try {
            const { session_id } = req.params;
            const players = await SessionModel.getPlayerBySessionId(session_id);
            res.status(HTTP_STATUS.OK).json(players);
        } catch (err) {
            next(err);
        }
    }

    async getLeaderBoard(req, res, next) {
        try {
            const { session_id } = req.params;
            const leaderBoard = await SessionModel.getLeaderBoard(session_id);
            res.status(HTTP_STATUS.OK).json(leaderBoard);
        } catch (err) {
            next(err);
        }
    }

    async getSessionByCodeJoin(req, res, next) {
        try {
            const { code_join } = req.params;
            const session = await SessionModel.getSessionByCodeJoin(code_join);
            if (!session) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Session not found' });
            }
            res.status(HTTP_STATUS.OK).json(session);
        } catch (err) {
            next(err);
        }
    }

    async getQuestion(req, res, next) {
        try {
            const { session_id } = req.params;

            const canva_id = (await SessionModel.findById(session_id)).canva_id;
            let questions = await SessionModel.findQuestionsByCanvaId(canva_id);
            questions = questions.map(e => {
                return {
                    ...e,
                    lua_chon: e.lua_chon?.map(j => {
                        return {
                            ...j,
                            dung: undefined
                        }
                    }) || [],
                }
            })
            res.status(HTTP_STATUS.OK).json(questions);

        } catch (err) {
            next(err);
        }
    }

    async getAllPublicSessions(req, res, next) {
        try {
            // const sessions = await SessionModel.
        }
        catch (err) {
            next(err);
        }
    }

    async nopBai(req, res, next) {
    }

}

export default new SessionController();
