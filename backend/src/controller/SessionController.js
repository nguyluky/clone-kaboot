
import {
    findAll,
    findById,
    findByCanvaId,
    createSession,
    updateSession,
    deleteSession,
    getSessionByCodeJoin,
    getPlayerBySessionId,
    getLeaderBoard,

} from '../model/SessionModel.js';

import { findByCanvaId as findQuestionsByCanvaId, findLuaChonById } from '../model/CauHoiModel.js'
import { findById as filePlayerById, updatePlayer } from '../model/PlayerModel.js';
import HTTP_STATUS from '../constants/httpStatus.js';

class SessionController {
    async getAllSessions(req, res) {
        try {
            const sessions = await findAll();
            res.status(HTTP_STATUS.OK).json(sessions);
        } catch (err) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching sessions' });
        }
    }

    async getSessionById(req, res) {
        try {
            const { session_id } = req.params;
            const session = await findById(session_id);
            if (!session) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Session not found' });
            }
            res.status(HTTP_STATUS.OK).json(session);
        } catch (err) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching session' });
        }
    }

    async getSessionsByCanvaId(req, res) {
        try {
            const { canva_id } = req.params;
            const sessions = await findByCanvaId(canva_id);
            if (sessions.length === 0) {
                return res
                    .status(HTTP_STATUS.NOT_FOUND)
                    .json({ message: 'No sessions found for this canva' });
            }
            res.status(HTTP_STATUS.OK).json(sessions);
        } catch (err) {
            res
                .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({ message: 'Error fetching sessions by canva' });
        }
    }

    async createSession(req, res) {
        try {
            const { title, code_join, canva_id, thoi_gian_bat_dau, trang_thai } = req.body;
            const session = await createSession({
                title,
                code_join,
                canva_id,
                thoi_gian_bat_dau,
                trang_thai,
            });
            res.status(HTTP_STATUS.CREATED).json(session);
        } catch (err) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: String(err) });
        }
    }

    async updateSession(req, res) {
        try {
            const { session_id } = req.params;
            const { title, code_join, canva_id, thoi_gian_bat_dau, trang_thai } = req.body;
            const result = await updateSession(session_id, {
                title,
                code_join,
                canva_id,
                thoi_gian_bat_dau: thoi_gian_bat_dau ? new Date(thoi_gian_bat_dau) : null,
                trang_thai,
            });
            if (result.affectedRows === 0) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Session not found' });
            }
            res.status(HTTP_STATUS.NO_CONTENT).json({ message: 'Session updated successfully' });
        } catch (err) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: String(err) });
        }
    }

    async deleteSession(req, res) {
        try {
            const { session_id } = req.params;
            const result = await deleteSession(session_id);
            if (result.affectedRows === 0) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Session not found' });
            }
            res.status(HTTP_STATUS.NO_CONTENT).json({ message: 'Session deleted successfully' });
        } catch (err) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error deleting session' });
        }
    }

    async getPlayerBySessionId(req, res) {
        try {
            const { session_id } = req.params;
            const players = await getPlayerBySessionId(session_id);
            res.status(HTTP_STATUS.OK).json(players);
        } catch (err) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching players' });
        }
    }

    async getLeaderBoard(req, res) {
        try {
            const { session_id } = req.params;
            const leaderBoard = await getLeaderBoard(session_id);
            res.status(HTTP_STATUS.OK).json(leaderBoard);
        } catch (err) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching leader board' });
        }
    }

    async getSessionByCodeJoin(req, res) {
        try {
            const { code_join } = req.params;
            const session = await getSessionByCodeJoin(code_join);
            if (!session) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Session not found' });
            }
            res.status(HTTP_STATUS.OK).json(session);
        } catch (err) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: String(err) });
        }
    }

    async getQuestion(req, res) {
        try {
            const { session_id } = req.params;

            const canva_id = (await findById(session_id)).canva_id;
            let questions = await findQuestionsByCanvaId(canva_id);
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
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching question' });
            console.log(err)
        }
    }

}

export default new SessionController();
