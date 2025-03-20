
import pool from '../config/database.js';
import BaseModel from './BaseModel.js';


/**
 * @extends BaseModel<CanvaType, 'canva_id'>
 */
class CanvaModel extends BaseModel {
    constructor() {
        super('canva', 'canva_id');
    }
}

export default new CanvaModel();