import { Router } from 'express';
import database from '../database.js';

const router = Router();

// Query Builder
const buildClientExerciseReadQuery = (id, variant) => {
    let sql = '';
    let table = 'exerciseinfo';
    let fields = ['ExerciseInfoID', 'DateDone', 'AmountCompleted', 'InfoExerciseID', 'InfoClientID', 'Favourite'];
    let extendedTable = `exercises LEFT JOIN ${table} ON exercises.ExerciseID = exerciseinfo.InfoExerciseID`;
    let extendedFields = `${fields}, exercises.ExerciseName, exercises.ExerciseDescription`;

    switch (variant) {
        case 'InfoID':
            sql = `SELECT ${extendedFields} FROM ${extendedTable}`;
            if (id) sql += ` WHERE exerciseinfo.InfoClientID=:ID`;
            break;
        case 'exerciseID':
            sql = `SELECT ${fields} FROM ${table}`;
            if (id) sql += ` WHERE exerciseinfo.ExerciseInfoID=:ID`;
            break;
        default:
            sql = `SELECT ${fields} FROM ${table}`;
            if (id) sql += ` WHERE exerciseinfo.ExerciseInfoID=:ID`;
    }
    //console.log(sql)
    return { sql, data: { ID: id} };
}
// Data Accessor
const read = async (query) => {
    try {
        //const { sql, data } = buildClientExerciseReadQuery(id, variant);
        const [result] = await database.query(query.sql, query.data);
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
    const query = buildClientExerciseReadQuery(id, variant);
    const { isSuccess, result, message } = await read(query);
    if(!isSuccess) return res.status(404).json({message});

    // Response to request 
    res.status(200).json(result);
};

// PUT
const putExerciseController = async (req, res) => {
    // Validate request
    const id = req.params.id;
    const record = req.body;
    // Access data
    const sql = buildExercisePutSql();
    const { isSuccess, result, message: accessorMessage } = await updateExercises(sql, id, record);
    if (!isSuccess) return res.status(400).json({ message: accessorMessage });
    res.status(200).json(result);
};

const buildSetFields = (fields) => fields.reduce((setSQL, field, index) =>
setSQL + `${field}=:${field}` + ((index === fields.length - 1) ? '' : ', '), 'SET ');

// PUT SQL Exercises
const buildExercisePutSql = () => {
    let table = 'exerciseinfo';
    let mutableFields = ['ExerciseInfoID', 'DateDone', 'AmountCompleted', 'InfoExerciseID', 'InfoClientID', 'Favourite'];
    const sql = `UPDATE ${table} ` + buildSetFields(mutableFields) + ` WHERE ExerciseInfoID=:ExerciseInfoID`;
    //console.log(sql);
    return sql;
}


// PUT CREATE Appointments
const updateExercises = async (sql, id, record) => {
    try {
        const status = await database.query(sql, { ...record, ExerciseInfoID: id });

        if (status[0].affectedRows === 0)
        return { isSuccess: false, result: null, message: `Failed to update record: no rows affected` };

        const recoverRecordSql = buildClientExerciseReadQuery(id, null);
        console.log(recoverRecordSql)
        const { isSuccess, result, message } = await read(recoverRecordSql);
        
        return isSuccess

            ? { isSuccess: true, result: result, message: 'Record(s) successfully recovered' }
            : { isSuccess: false, result: null, message: `Failed to recover the updated record: ${message}` };
    }
    catch (error) {
        return { isSuccess: false, result: null, message: `Failed to execute query: ${error.message}` };
    }
};





// Endpoints
router.get('/', (req, res) => clientExerciseController(req, res, null));
router.get('/:id', (req, res) => clientExerciseController(req, res, 'exerciseID'));
router.get('/clients/:id', (req, res) => clientExerciseController(req, res, 'InfoID'));
router.put('/:id', putExerciseController);

export default router;