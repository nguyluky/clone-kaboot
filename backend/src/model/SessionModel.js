import pool from '../config/database.js';
import BaseModel from './BaseModel.js';

/** * @extends {BaseModel<SessionType, 'session_id'>} */
class SessionModel extends BaseModel {
    constructor() {
        super('session', 'session_id');
    }

    getByCanvaId(canvaId) {
        return this.findAll({ canva_id: canvaId });
    }

    async getByCodeJoin(codeJoin) {
        return await this.findOne({ code_join: codeJoin });
    }

    async getPublicSessions() {
        return await this.findAll({ is_public: 1 });
    }

}

export default new SessionModel();
