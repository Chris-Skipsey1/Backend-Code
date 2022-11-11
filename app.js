// Imports----------------------------------
import express from 'express';
import { createConnection } from 'mysql2';
import database from './database.js';

// Configure express app ----------------------------------
const app = new express();




// Configure middleware ----------------------------------
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.json());
app.use(express.urlencoded({extended:true}));


// Controllers ----------------------------------
// Medicines GET Controller
const medicinesController = async (req, res) => {
    //Build SQL
    const table = 'medicines';
    const fields = ['MedicineID','MedicineName', 'MedicineDescription', 'MedicineTakenDate'];
    const extendedTable = `${table}` //LEFT JOIN prescriptions ON Prescriptions.PrescriptionMedicineID = Medicines.MedicineID`;
    const extendedFields = `${fields}`//, medicines.MedicineID, medicines.MedicineName, Prescriptions.PrescriptionDosage`;
    const sql = `SELECT ${extendedFields} FROM ${extendedTable}`;
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

// Medicines Prescription GET Controller
const medicinesPrescriptionController = async (req, res) => {
    const id = req.params.id;
    //Build SQL
    const table = 'medicines';
    const whereField = 'prescriptions.PrescriptionClientID';
    const fields = ['MedicineID','MedicineName', 'MedicineDescription', 'MedicineTakenDate'];
    const extendedTable = `prescriptions LEFT JOIN ${table} ON prescriptions.PrescriptionMedicineID = medicines.MedicineID`;
    const extendedFields = `${fields}, medicines.MedicineID, medicines.MedicineName, prescriptions.PrescriptionDosage`;
    const sql = `SELECT ${extendedFields} FROM ${extendedTable} WHERE ${whereField}=${id}`;
    console.log(sql);
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

// Personal Trainers GET Controller
const personaltrainersController = async (req, res) => {
    //Build SQL
    const table = 'personaltrainers';
    const fields = ['PersonalTrainerID', 'PersonalTrainerName'];
    const whereTrainer = 'personaltrainers.PersonalTrainerName';
    const extendedTable = `${table}` 
    const extendedFields = `${fields}`
    const sql = `SELECT ${extendedFields} FROM ${extendedTable}`;
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

// Locations GET Controller
const locationsController = async (req, res) => {
    const id = req.params.id;
    //Build SQL
    const table = 'locations';
    const fields = ['LocationID', 'LocationName'];
    const whereLocations = 'locations.LocationID';
    const extendedTable = `${table}` //LEFT JOIN prescriptions ON Prescriptions.PrescriptionMedicineID = Medicines.MedicineID`;
    const extendedFields = `${fields}`//, medicines.MedicineID, medicines.MedicineName, Prescriptions.PrescriptionDosage`;
    const sql = `SELECT ${extendedFields} FROM ${extendedTable} WHERE ${whereLocations}=${id}`;
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

// Slot States GET Controller
const slotstatesController = async (req, res) => {
    const id = req.params.id;
    //Build SQL
    const table = 'slotstates';
    const fields = ['SlotStateID', 'SlotStateName'];
    const whereLocations = 'slotstates.SlotStateID';
    const extendedTable = `${table}` //LEFT JOIN prescriptions ON Prescriptions.PrescriptionMedicineID = Medicines.MedicineID`;
    const extendedFields = `${fields}`//, medicines.MedicineID, medicines.MedicineName, Prescriptions.PrescriptionDosage`;
    const sql = `SELECT ${extendedFields} FROM ${extendedTable} WHERE ${whereLocations}=${id}`;
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

// Availability GET Controller
const availabilityController = async (req, res) => {
    const id = req.params.id;
    //Build SQL
    const table = 'availability';
    const fields = ['AvailabilityID', 'DateAndTime', 'Duration'];
    const whereLocations = 'availability.AvailabilityID';
    const extendedTable = `${table}` //LEFT JOIN prescriptions ON Prescriptions.PrescriptionMedicineID = Medicines.MedicineID`;
    const extendedFields = `${fields}`//, medicines.MedicineID, medicines.MedicineName, Prescriptions.PrescriptionDosage`;
    const sql = `SELECT ${extendedFields} FROM ${extendedTable} WHERE ${whereLocations}=${id}`;
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

// Appointments ID POST Controller
const buildAppointmentsInsertSql = (record) => {
    let table = 'appointments';
    let mutablefields = ['AppointmentDescription', 'AppointmentAvailabilityID', 'AppointmentClientID'];
    return `INSERT INTO ${table} SET
        AppointmentDescription="${record['AppointmentDescription']}",
        AppointmentAvailabilityID=${record['AppointmentAvailabilityID']},
        AppointmentClientID=${record['AppointmentClientID']}`;
};

const postAppointmentsController = async (req, res) => {

const sql = buildAppointmentsInsertSql(req.body);
const { isSuccess, result, message: accessorMessage } = await create(sql);
if (!isSuccess) return res.status(404).json({ message: accessorMessage });
res.status(201).json(result);
};

const create = async (sql) => {
    try {
        const status = await database.query(sql);
        const recoverRecordSql = buildAppointmentSelectSql(status[0].insertId, null);
        const {isSuccess, result, message} = await read(recoverRecordSql);

        return isSuccess
    
        ? { isSuccess: true, result: result, message: 'Record(s) successfully recovered' }
        : { isSuccess: false, result: null, message: `Failed to recover the inserted record: ${message}` };
    }
    catch (error) {
        return { isSuccess: false, result: null, message: `Failed to execute query: ${error.message}`};
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
 

// Availability and Personal Trainer GET Controller
const availabilityPersonalTrainerController = async (req, res) => {
    const id = req.params.id;
    //Build SQL
    const table = 'availability';
    const fields = ['AvailabilityID', 'DateAndTime', 'Duration', 'AvailabilityPersonalTrainerID', 'AvailabilityLocationID', 'AvailabilitySlotStateID'];
    const wherePersonal = 'availability.AvailabilityPersonalTrainerID';
    const extendedTable = `${table}` 
    const extendedFields = `${fields}`
    const sql = `SELECT ${extendedFields} FROM ${extendedTable} WHERE ${wherePersonal}=${id}`;
    console.log(sql);
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

const buildAppointmentSelectSql = (id) => {
    const table = 'appointments';
    const fields = ['AppointmentID', 'AppointmentDescription', 'AppointmentAvailabilityID', 'AppointmentClientID'];
    const whereLocations = 'appointments.AppointmentID';
    const extendedTable = `${table}` //LEFT JOIN prescriptions ON Prescriptions.PrescriptionMedicineID = Medicines.MedicineID`;
    const extendedFields = `${fields}`//, medicines.MedicineID, medicines.MedicineName, Prescriptions.PrescriptionDosage`;
    const sql = `SELECT ${extendedFields} FROM ${extendedTable} WHERE ${whereLocations}=${id}`;
    return sql;
}
const buildAppointmentsSelectSql = () => {
    const table = 'appointments';
    const fields = ['AppointmentID','AppointmentDescription', 'AppointmentAvailabilityID', 'AppointmentClientID'];
    const extendedTable = `${table}` 
    const extendedFields = `${fields}`
    const sql = `SELECT ${extendedFields} FROM ${extendedTable}`;
    return sql;

}
// Appointment GET Controller
const getAppointmentController = async (req, res) => {
    const id = req.params.id;
    //Build SQL
    const sql = buildAppointmentSelectSql(id);
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


const getAppointmentsController = async (req, res) => {
    //Build SQL
    const sql = buildAppointmentsSelectSql();
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


// Endpoints ----------------------------------

// Medicines
app.get('/api/medicines', medicinesController);
app.get('/api/medicines/clients/:id', medicinesPrescriptionController);
// Personal Trainers
app.get('/api/personaltrainers', personaltrainersController);
// Locations
app.get('/api/locations/:id', locationsController);
// Slot States
app.get('/api/slotstates/:id', slotstatesController);
// Availability
app.get('/api/availability/:id', availabilityController);
// Appointments
app.get('/api/appointments', getAppointmentsController);
app.get('/api/appointments/:id', getAppointmentController);
app.post('/api/appointments', postAppointmentsController);
// Slots Provider
app.get('/api/availability/personaltrainers/:id', availabilityPersonalTrainerController);


// Start server ----------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));