import { Router } from 'express';
import database from '../database.js';

const router = Router();

// Query Builder
const buildPersonaltrainerSql = (id, variant) => {
    let sql = '';
    //Build SQL
    let table = 'personaltrainers';
    let fields = ['PersonalTrainerID', 'PersonalTrainerName'];
    let whereTrainer = 'personaltrainers.PersonalTrainerID';

    switch (variant) {
        case 'ID':
            sql = `SELECT ${fields} FROM ${table}`;
            if (id) sql += ` WHERE ${whereTrainer}=:ID`;
            break;
        default:
            sql = `SELECT ${fields} FROM ${table}`;
    }
    return sql;
}
// Data Accessor
const read = async (sql, id) => {

    try {
        const [result] = await database.query(sql, { ID: id });
        return (result.length === 0)
            ? { isSuccess: false, result: null, message: 'No record(s) found' }
            : { isSuccess: true, result: result, message: 'Record(s) successfully recovered' };
    }
    catch (error) {
        return { isSuccess: false, result: null, message: `Failed to execute query: ${error.message}` };
    }
}
// Controller
const personalTrainersController = async (req, res, variant) => {
    const id = req.params.id;
    // Access data
    const sql = buildPersonaltrainerSql(id, variant);
    const { isSuccess, result, message } = await read(sql, id);
    if(!isSuccess) return res.status(404).json({message});

    // Response to request 
    res.status(200).json(result);
};
// Endpoints
router.get('/', (req, res) => personalTrainersController(req, res, null)); //REFACTORED
router.get('/:id', (req, res) => personalTrainersController(req, res, 'ID')); //REFACTORED

export default router;