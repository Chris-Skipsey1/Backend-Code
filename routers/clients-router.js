import { Router } from 'express';
import database from '../database.js';

const router = Router();


// Query Builder
const buildClientsSql = (id, variant) => {
    let sql = '';
    //Build SQL
    let table = 'clients';
    let fields = ['ClientID', 'ClientName'];
    let whereTrainer = 'clients.ClientID';

    switch (variant) {
        case 'ClientID':
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
const clientsController = async (req, res, variant) => {
    const id = req.params.id;
    // Access data
    const sql = buildClientsSql(id, variant);
    const { isSuccess, result, message } = await read(sql);
    if(!isSuccess) return res.status(404).json({message});

    // Response to request 
    res.status(200).json(result);
};
// Endpoints
router.get('/', (req, res) => clientsController(req, res, null)); 
router.get('/:id', (req, res) => clientsController(req, res, 'ClientID')); 

export default router;

