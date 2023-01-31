import { Router } from 'express';
import database from '../database.js';

const router = Router();

// Query Builder
const buildAvailabilityPersonalTrainerSelectSql = (id, variant) => {
    let sql = '';
    let table = 'availability';
    let fields = ['AvailabilityID', 'DateAndTime', 'Duration', 'AvailabilityPersonalTrainerID', 'AvailabilityLocationID', 'AvailabilitySlotStateID'];
    const extendedTable = `${table}`
    const extendedFields = `${fields}`
    let whereLocations = 'availability.AvailabilityID';

    switch (variant) {
        case 'AvailabilityID':
            sql = `SELECT ${fields} FROM ${table} WHERE ${whereLocations}=:ID`;
            break;
            case 'AvailabilityPersonalTrainerID':
                sql = `SELECT ${extendedFields} FROM ${extendedTable}`;
                if (id) sql += ` WHERE AvailabilityPersonalTrainerID=:ID`;
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
const availabilityController = async (req, res, variant) => {
    const id = req.params.id;
    // Access data
    const sql = buildAvailabilityPersonalTrainerSelectSql(id, variant);
    const { isSuccess, result, message } = await read(sql, id);
    if(!isSuccess) return res.status(404).json({message});

    // Response to request 
    res.status(200).json(result);
};
// Endpoints
router.get('/', (req, res) => availabilityController(req, res, null));
router.get('/:id', (req, res) => availabilityController(req, res, 'AvailabilityID'));
router.get('/personaltrainers/:id', (req, res) => availabilityController(req, res, 'AvailabilityPersonalTrainerID'));

export default router;