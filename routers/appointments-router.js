import { Router } from 'express';
import database from '../database.js';

const router = Router();

// Query builders / Data accessors---
const buildAllAppointmentsSelectSql = (id, variant) => {
    let sql = '';
    let table = 'appointments';
    let fields = ['AppointmentID', 'AppointmentDescription', 'AppointmentAvailabilityID', 'AppointmentClientID', 'AppointmentAvailabilityID' ];
    const extendedTable = `((${table} LEFT JOIN clients ON appointments.AppointmentClientID = clients.ClientID) 
                            LEFT JOIN availability ON appointments.AppointmentAvailabilityID = availability.AvailabilityID)
                            LEFT JOIN personaltrainers ON availability.AvailabilityPersonalTrainerID = personaltrainers.PersonalTrainerID`    
     const extendedFields = `${fields}, clients.ClientID, clients.ClientName, availability.AvailabilityPersonalTrainerID, personaltrainers.PersonalTrainerName,
                            availability.AvailabilityID, availability.DateAndTime`;
    let whereLocations = 'appointments.AppointmentID';

    switch (variant) {
        case 'clientappointments':
            sql = `SELECT ${extendedFields} FROM ${extendedTable}`;
            if (id) sql += ` WHERE ClientID=${id}`;
            break;
        default:
            sql = `SELECT ${fields} FROM ${table}`;
            if (id) sql += ` WHERE AppointmentID=${id}`;
    }
    return sql;
}

const buildAppointmentsCreateQuery = (record) => {
    let table = 'appointments';
    let mutablefields = ['AppointmentDescription', 'AppointmentAvailabilityID', 'AppointmentClientID'];
    const sql = `INSERT INTO ${table} SET
        AppointmentDescription="${record['AppointmentDescription']}",
        AppointmentAvailabilityID=${record['AppointmentAvailabilityID']},
        AppointmentClientID=${record['AppointmentClientID']}`;
        return { sql, data: record };
};


const create = async (sql) => {
    try {
        const status = await database.query(sql);
        const recoverRecordSql = buildAllAppointmentsSelectSql(status[0].insertId, null);
        const { isSuccess, result, message } = await read(recoverRecordSql);

        return isSuccess

            ? { isSuccess: true, result: result, message: 'Record(s) successfully recovered' }
            : { isSuccess: false, result: null, message: `Failed to recover the inserted record: ${message}` };
    }
    catch (error) {
        return { isSuccess: false, result: null, message: `Failed to execute query: ${error.message}` };
    }
};
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
};

// Controllers---
const getAppointmentsController = async (req, res, variant) => {
    const id = req.params.id;
    //Build SQL
    const sql = buildAllAppointmentsSelectSql(id, variant);
    // Execute query
    let isSuccess = false;
    let message = "";
    let result = null;
    try {
        [result] = await database.query(sql);
        if (result.length === 0) message = 'No record(s) found';
        else {
            isSuccess = true;
            message = 'Record(s) successfully recovered';
        }
    }
    catch (error) {
        message = `Failed to execute query: ${error.message}`;
    }
    //Responses
    isSuccess
        ? res.status(200).json(result)
        : res.status(400).json({ message });
};

const postAppointmentsController = async (req, res) => {
    const record = req.body;
    const query = buildAppointmentsCreateQuery(record);
    const { isSuccess, result, message: accessorMessage } = await create(query);
    if (!isSuccess) return res.status(404).json({ message: accessorMessage });
    res.status(201).json(result);
};

const buildSetFields = (fields) => fields.reduce((setSQL, field, index) =>
setSQL + `${field}=:${field}` + ((index === fields.length - 1) ? '' : ', '), 'SET ');

// PUT Appointments SQL
const buildAppointmentsUpdateSql = () => {
    let table = 'appointments';
    let mutableFields = ['AppointmentDescription', 'AppointmentAvailabilityID'];
    const sql = `UPDATE ${table} ` + buildSetFields(mutableFields) + ` WHERE AppointmentID=:AppointmentID`;
    console.log(sql);
    return sql;
}

// PUT Appointments Controller
const putAppointmentsController = async (req, res) => {
    // Validate request
    const id = req.params.id;
    const record = req.body;
    // Access data
    const sql = buildAppointmentsUpdateSql();
    const { isSuccess, result, message: accessorMessage } = await updateAppointments(sql, id, record);
    if (!isSuccess) return res.status(400).json({ message: accessorMessage });
    res.status(200).json(result);
};


// PUT CREATE Appointments
const updateAppointments = async (sql, id, record) => {
    try {
        const status = await database.query(sql, { ...record, AppointmentID: id });

        if (status[0].affectedRows === 0)
        return { isSuccess: false, result: null, message: `Failed to update record: no rows affected` };

        const recoverRecordSql = buildAllAppointmentsSelectSql(id, null);
        const { isSuccess, result, message } = await read(recoverRecordSql);

        return isSuccess

            ? { isSuccess: true, result: result, message: 'Record(s) successfully recovered' }
            : { isSuccess: false, result: null, message: `Failed to recover the updated record: ${message}` };
    }
    catch (error) {
        return { isSuccess: false, result: null, message: `Failed to execute query: ${error.message}` };
    }
};


// DELETE Appointments Controller
const deleteAppointmentController = async (req, res) => {
    // Validate request
    const id = req.params.id;
    const record = req.body;
    // Access data
    const sql = buildAppointmentsDeleteSql();
    const { isSuccess, result, message: accessorMessage } = await deleteAppointments(sql, id);
    if (!isSuccess) return res.status(400).json({ message: accessorMessage });
    res.status(202).json({ message: accessorMessage });
};

// DELETE Appointments
const deleteAppointments = async (sql, id) => {
    try {
        const status = await database.query(sql, { AppointmentID: id });
        return status[0].affectedRows === 0 
            ? { isSuccess: false, result: null, message: `Failed to delete record: ${id}` }
            : { isSuccess: true, result: null, message: 'Record(s) successfully deleted' };
    }
    catch (error) {
        return { isSuccess: false, result: null, message: `Failed to execute query: ${error.message}` };
    }
};

// DELETE Appointments SQL
const buildAppointmentsDeleteSql = () => {
    let table = 'appointments';
    return `DELETE FROM ${table} WHERE AppointmentID=:AppointmentID`;
}

// Endpoints---
router.get('/clients/:id', (req, res) => getAppointmentsController(req, res, 'clientappointments'));
router.get('/', (req, res) => getAppointmentsController(req, res, null));
router.get('/:id(\\d+)', (req, res) => getAppointmentsController(req, res, null));
router.post('/', postAppointmentsController);

// New endpoint
router.put('/:id',putAppointmentsController);
router.delete('/:id', deleteAppointmentController);

export default router;