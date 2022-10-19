// Imports----------------------------------
import express from 'express';
import database from './database.js';

// Configure express app ----------------------------------
const app = new express();

// Configure middleware ----------------------------------

// Controllers ----------------------------------
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

// Endpoints ----------------------------------
app.get('/api/medicines', medicinesController);
app.get('/api/medicines/clients/:id', medicinesPrescriptionController);

// Start server ----------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));