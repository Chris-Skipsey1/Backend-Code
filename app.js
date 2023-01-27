// Imports----------------------------------
import express from 'express';
import { createConnection } from 'mysql2';
import database from './database.js';
import appointmentsRouter from './routers/appointments-router.js';

// Configure express app ----------------------------------
const app = new express();




// Configure middleware ----------------------------------
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.get('/api/appointments/clients/:id', (req, res) => getAppointmentsController(req, res, 'clientappointments'));

// Controllers ----------------------------------

// Build Medicines REFACTORED Controller--------------------------
const buildMedicinesSelectSql = (id, variant) => {
    let sql = '';

    let table = 'medicines';
    let fields = ['MedicineID', 'MedicineName', 'MedicineDescription', 'MedicineTakenDate'];
    let extendedTable = `prescriptions LEFT JOIN ${table} ON prescriptions.PrescriptionMedicineID = medicines.MedicineID`;
    let extendedFields = `${fields}, medicines.MedicineID, medicines.MedicineName, prescriptions.PrescriptionDosage`;

    switch (variant) {
        case 'prescriptions':
            sql = `SELECT ${extendedFields} FROM ${extendedTable}`;
            if (id) sql += ` WHERE PrescriptionClientID=${id}`;
            break;
        default:
            sql = `SELECT ${fields} FROM ${table}`;
            if (id) sql += ` WHERE MedicineID=${id}`;
    }
    return sql;
}

// Medicines GET REFACTORED Controller
const read1 = async (selectSql) => {

    try {
        const [result] = await database.query(selectSql);
        return (result.length === 0)
            ? { isSuccess: false, result: null, message: 'No record(s) found' }
            : { isSuccess: true, result: result, message: 'Record(s) successfully recovered' };
    }
    catch (error) {
        return { isSuccess: false, result: null, message: `Failed to execute query: ${error.message}` };
    }
}

const getMedicinesController = async (req, res, variant) => {
    const id = req.params.id;
    // Access data
    const sql = buildMedicinesSelectSql(id, variant);
    const { isSuccess, result, message } = await read1(sql);
    if(!isSuccess) return res.status(404).json({message});

    // Response to request 
    res.status(200).json(result);
};
// --------------------------

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

// Build Appointments REFACTORED Controller--------------------------
// Appointments GET REFACTORED Controller


// GET a Client's appointment

const clientsAppointmentController = async (req, res) => {
    const id = req.params.id;
    //Build SQL
    let table = 'appointments';
    const whereField = 'clients.ClientID';
    const fields = ['AppointmentID','AppointmentDescription', 'AppointmentAvailabilityID'];
    const extendedTable = `((${table} LEFT JOIN clients ON appointments.AppointmentClientID = clients.ClientID) 
                            LEFT JOIN availability ON appointments.AppointmentAvailabilityID = availability.AvailabilityID)
                            LEFT JOIN personaltrainers ON availability.AvailabilityPersonalTrainerID = personaltrainers.PersonalTrainerID`                                                                 
    const extendedFields = `${fields}, clients.ClientID, clients.ClientName, availability.AvailabilityPersonalTrainerID, personaltrainers.PersonalTrainerName,
     availability.AvailabilityID, availability.DateAndTime`;
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


// GET Excercises
const exerciseController = async (req, res) => {
    const id = req.params.id;
    //Build SQL
    const table = 'exercises';
    const fields = ['ExerciseID', 'ExerciseName', 'ExerciseDescription'];
    const extendedTable = `${table}`;
    const extendedFields = `${fields}`;
    const sql = `SELECT ${extendedFields} FROM ${extendedTable}`;
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


// GET Client's Excercises
const clientExerciseController = async (req, res) => {
    const id = req.params.id;
    //Build SQL
    let table = 'exerciseinfo';
    const whereField = 'exerciseinfo.InfoClientID';
    const fields = ['ExerciseInfoID', 'DateDone', 'AmountCompleted', 'InfoExerciseID', 'InfoClientID'];
    const extendedTable = `exercises LEFT JOIN ${table} ON exercises.ExerciseID = exerciseinfo.InfoExerciseID`; 
    const extendedFields = `${fields}, exercises.ExerciseName, exercises.ExerciseDescription`;
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



// --------------------------

// Endpoints ----------------------------------
// Medicines
app.get('/api/medicines', (req, res) => getMedicinesController(req, res, null)); //REFACTORED
app.get('/api/medicines/clients/:id', (req, res) => getMedicinesController(req, res, 'prescriptions')); //REFACTORED
// Personal Trainers
app.get('/api/personaltrainers', personaltrainersController);
// Locations
app.get('/api/locations/:id', locationsController);
// Slot States
app.get('/api/slotstates/:id', slotstatesController);
// Availability
app.get('/api/availability/:id', availabilityController);
// Appointments

// Slots Provider
app.get('/api/availability/personaltrainers/:id', availabilityPersonalTrainerController);

//Client's Appointments
app.use('/api/appointments', appointmentsRouter);


//Client's Exercises
app.get('/api/exercises', exerciseController);
app.get('/api/exercises/clients/:id', clientExerciseController);

// Start server ----------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));