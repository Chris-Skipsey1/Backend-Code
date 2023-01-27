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
        case 'specific':
            sql = `SELECT ${fields} FROM ${table} WHERE ${whereLocations}=${id}`;
            break;
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


// Endpoints---
router.get('/clients/:id', (req, res) => getAppointmentsController(req, res, 'clientappointments'));
router.get('/', (req, res) => getAppointmentsController(req, res, null));
router.get('/:id', (req, res) => getAppointmentsController(req, res, 'specific'));

export default router;