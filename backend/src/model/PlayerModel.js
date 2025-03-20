import pool from '../config/database.js';
import { v4 as uuid } from 'uuid'
import BaseModel from './BaseModel.js';


/** * @extends {BaseModel<PlayerType, 'uuid'>} */
class PlayerModel extends BaseModel {
    constructor() {
        super('player', 'uuid');
    }

    create(data) {
        data.bai_lam = JSON.stringify(data.bai_lam);
        return super.create({ ...data, uuid: uuid() });
    }

    update(uuid, data) {
        data.bai_lam = JSON.stringify(data.bai_lam);
        return super.update(uuid, data);
    }

    getBySessionId(sessionId) {
        return this.findAll({ session_id: sessionId });
    }
}

export default new PlayerModel();