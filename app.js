import express from 'express';
import appointmentsRouter from './routers/appointments-router.js';
import medicinesRouter from './routers/medicines-router.js';
import personaltrainers from './routers/personaltrainers-router.js';
import exercise from './routers/exercise-router.js';
import availability from './routers/availability-router.js';
import slotstates from './routers/slotstate-router.js';
import locations from './routers/locations-router.js';
import clients from './routers/clients-router.js';
import cors from 'cors';

// Configure express app ----------------------------------
const app = new express();

// Configure middleware - need to run front and backend at same time 
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));

// Endpoints ----------------------------------
// Medicines
app.use('/api/medicines', medicinesRouter);
// Appointments
app.use('/api/appointments', appointmentsRouter);
// Personal Trainers
app.use('/api/personaltrainers', personaltrainers);
// Exercises
app.use('/api/exercises', exercise);
// Availability
app.use('/api/availability', availability);
// Slot States
app.use('/api/slotstates', slotstates);
// Locations
app.use('/api/locations', locations);
// Clients
app.use('/api/clients', clients);

// Start server ----------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));