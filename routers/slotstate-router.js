import { Router } from 'express';
import database from '../database.js';

const router = Router();


// Query Builder
const buildSlotStateSql = (id, variant) => {
    let sql = '';
    //Build SQL
    let table = 'slotstates';
    let fields = ['SlotStateID', 'SlotStateName'];
    let whereTrainer = 'slotstates.SlotStateID';

    switch (variant) {
        case 'SlotID':
            sql = `SELECT ${fields} FROM ${table}`;
            if (id) sql += ` WHERE ${whereTrainer}=${id}`;
            break;
        default:
            sql = `SELECT ${fields} FROM ${table}`;
    }
    return sql;
}
// Data Accessor
const read = async (sql) => {

    try {
        const [result] = await database.query(sql);
        return (result.length === 0)
            ? { isSuccess: false, result: null, message: 'No record(s) found' }
            : { isSuccess: true, result: result, message: 'Record(s) successfully recovered' };
    }
    catch (error) {
        return { isSuccess: false, result: null, message: `Failed to execute query: ${error.message}` };
    }
}
// Controller
const slotStatesController = async (req, res, variant) => {
    const id = req.params.id;
    // Access data
    const sql = buildSlotStateSql(id, variant);
    const { isSuccess, result, message } = await read(sql);
    if(!isSuccess) return res.status(404).json({message});

    // Response to request 
    res.status(200).json(result);
};
// Endpoints
router.get('/', (req, res) => slotStatesController(req, res, null)); //REFACTORED
router.get('/:id', (req, res) => slotStatesController(req, res, 'SlotID')); //REFACTORED

export default router;