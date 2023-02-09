import { Router } from 'express';
import database from '../database.js';

const router = Router();

// Query Builder
const buildClientExerciseReadQuery = (id, variant) => {
    let sql = '';
    let table = 'exerciseinfo';
    let fields = ['ExerciseInfoID', 'DateDone', 'AmountCompleted', 'InfoExerciseID', 'InfoClientID'];
    let extendedTable = `exercises LEFT JOIN ${table} ON exercises.ExerciseID = exerciseinfo.InfoExerciseID`;
    let extendedFields = `${fields}, exercises.ExerciseName, exercises.ExerciseDescription`;

    switch (variant) {
        case 'InfoID':
            sql = `SELECT ${extendedFields} FROM ${extendedTable}`;
            if (id) sql += ` WHERE exerciseinfo.InfoClientID=:ID`;
            break;
        default:
            sql = `SELECT ${fields} FROM ${table}`;
    }
    return { sql, data: { ID: id} };
}
// Data Accessor
const read = async (id, variant) => {
    try {
        const { sql, data } = buildClientExerciseReadQuery(id, variant);
        const [result] = await database.query(sql, data);
        return (result.length === 0)
            ? { isSuccess: false, result: null, message: 'No record(s) found' }
            : { isSuccess: true, result: result, message: 'Record(s) successfully recovered' };
    }
    catch (error) {
        return { isSuccess: false, result: null, message: `Failed to execute query: ${error.message}` };
    }
}
// Controller
const clientExerciseController = async (req, res, variant) => {
    const id = req.params.id;
    // Access data

    const { isSuccess, result, message } = await read(id, variant);
    if(!isSuccess) return res.status(404).json({message});

    // Response to request 
    res.status(200).json(result);
};
// Endpoints
router.get('/', (req, res) => clientExerciseController(req, res, null));
router.get('/clients/:id', (req, res) => clientExerciseController(req, res, 'InfoID'));

export default router;