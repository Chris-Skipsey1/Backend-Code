import { Router } from 'express';
import database from '../database.js';

const router = Router();

// Query Builder
const buildMedicinesReadQuery = (id, variant) => {
    let sql = '';
    let table = 'medicines';
    let fields = ['MedicineID', 'MedicineName', 'MedicineDescription', 'MedicineTakenDate', 'MedicineURI', 'MedicineFavourite'];
    let extendedTable = `prescriptions LEFT JOIN ${table} ON prescriptions.PrescriptionMedicineID = medicines.MedicineID`;
    let extendedFields = `${fields}, medicines.MedicineID, medicines.MedicineName, medicines.MedicineURI, prescriptions.PrescriptionDosage`;

    switch (variant) {
        case 'prescriptions':
            sql = `SELECT ${extendedFields} FROM ${extendedTable}`;
            if (id) sql += ` WHERE PrescriptionClientID=:ID`;
            break;
            case 'byprescriptionID':
            sql = `SELECT ${fields} FROM ${table}`;
            if (id) sql += ` WHERE medicines.MedicineID=:ID`;
            break;
        default:
            sql = `SELECT ${fields} FROM ${table}`;
            if (id) sql += ` WHERE medicines.MedicineID=:ID`;
    }
    return { sql, data: { ID: id } };
}
// Data Accessors
const read = async (query) => {

    try {
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
const getMedicinesController = async (req, res, variant) => {
    const id = req.params.id;
    // Access data
    const query = buildMedicinesReadQuery(id, variant);
    const { isSuccess, result, message } = await read(query);
    if(!isSuccess) return res.status(404).json({message});

    // Response to request 
    res.status(200).json(result);
};

// PUT
const putMedicineController = async (req, res) => {
    // Validate request
    const id = req.params.id;
    const record = req.body;
    // Access data
    const sql = buildMedicinePutSql();
    const { isSuccess, result, message: accessorMessage } = await updateMedicines(sql, id, record);
    if (!isSuccess) return res.status(400).json({ message: accessorMessage });
    res.status(200).json(result);
};

const buildSetFields = (fields) => fields.reduce((setSQL, field, index) =>
setSQL + `${field}=:${field}` + ((index === fields.length - 1) ? '' : ', '), 'SET ');

// PUT SQL Exercises
const buildMedicinePutSql = () => {
    let table = 'medicines';
    let mutableFields = ['MedicineID', 'MedicineName', 'MedicineDescription', 'MedicineTakenDate', 'MedicineURI', 'MedicineFavourite'];
    const sql = `UPDATE ${table} ` + buildSetFields(mutableFields) + ` WHERE MedicineID=:MedicineID`;
    //console.log(sql);
    return sql;
}

// PUT CREATE Appointments
const updateMedicines = async (sql, id, record) => {
    try {
        const status = await database.query(sql, { ...record, MedicineID: id });

        if (status[0].affectedRows === 0)
        return { isSuccess: false, result: null, message: `Failed to update record: no rows affected` };

        const recoverRecordSql = buildMedicinesReadQuery(id, null);
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
router.get('/', (req, res) => getMedicinesController(req, res, null)); 
router.get('/:id', (req, res) => getMedicinesController(req, res, 'byprescriptionID'));
router.get('/clients/:id', (req, res) => getMedicinesController(req, res, 'prescriptions'));
router.put('/:id', putMedicineController);

export default router;