import { Router } from 'express';
import database from '../database.js';

const router = Router();

// Query Builder
const buildLocationsSql = (id, variant) => {
    let sql = '';
    //Build SQL
    let table = 'locations';
    let fields = ['LocationID', 'LocationName'];
    let whereTrainer = 'locations.LocationID';

    switch (variant) {
        case 'LocationID':
            sql = `SELECT ${fields} FROM ${table}`;
            if (id) sql += ` WHERE${whereTrainer}=${id}`;
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
const locationsController = async (req, res, variant) => {
    const id = req.params.id;
    // Access data
    const sql = buildLocationsSql(id, variant);
    const { isSuccess, result, message } = await read(sql);
    if(!isSuccess) return res.status(404).json({message});

    // Response to request 
    res.status(200).json(result);
};
// Endpoints
router.get('/', (req, res) => locationsController(req, res, null)); //REFACTORED
router.get('/:id', (req, res) => locationsController(req, res, 'LocationID')); //REFACTORED

export default router;