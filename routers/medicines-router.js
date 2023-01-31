import { Router } from 'express';
import database from '../database.js';

const router = Router();

// Query Builder
const buildMedicinesReadQuery = (id, variant) => {
    let sql = '';
    let table = 'medicines';
    let fields = ['MedicineID', 'MedicineName', 'MedicineDescription', 'MedicineTakenDate'];
    let extendedTable = `prescriptions LEFT JOIN ${table} ON prescriptions.PrescriptionMedicineID = medicines.MedicineID`;
    let extendedFields = `${fields}, medicines.MedicineID, medicines.MedicineName, prescriptions.PrescriptionDosage`;

    switch (variant) {
        case 'prescriptions':
            sql = `SELECT ${extendedFields} FROM ${extendedTable}`;
            if (id) sql += ` WHERE PrescriptionClientID=:ID`;
            break;
        default:
            sql = `SELECT ${fields} FROM ${table}`;
            if (id) sql += ` WHERE MedicineID=:ID`;
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
// Endpoints
router.get('/', (req, res) => getMedicinesController(req, res, null)); 
router.get('/clients/:id', (req, res) => getMedicinesController(req, res, 'prescriptions'));

export default router;